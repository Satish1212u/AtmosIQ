import axios from 'axios';
import logger from '../utils/logger.js';
import { MODEL_CONFIGS, OPENROUTER_CONFIG } from '../config/aiModels.js';
import { ApiError } from '../middleware/errorMiddleware.js';
import { getFullWeatherReport } from './weather/weatherService.js';
import {
  detectUserIntent,
  extractCity,
  fallbackLogic,
  getSystemPrompt,
  getWeeklyForecast,
  getHourlyForecast,
  getAQISummary
} from '../utils/aiFallback.js';

// ─── Retriable error classifier ──────────────────────────────────────────────
/**
 * Returns true only for transient/provider failures that should trigger fallback.
 * Non-retriable errors (401, 403, 400, invalid payload) break the cascade immediately.
 */
const isRetriableError = (error) => {
  // Network / timeout
  if (error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
    return true;
  }
  // No response at all (network failure)
  if (!error.response) return true;

  const status = error.response.status;
  // 429 Too Many Requests or any 5xx server error
  return status === 429 || (status >= 500 && status <= 599);
};

// ─── Telemetry optimizer ──────────────────────────────────────────────────────
/**
 * Strips raw API response fields, keeping only the essential telemetry
 * properties required for prompts and rendering to optimize context size.
 */
const optimizeTelemetryPayload = (weather, aqi, forecast) => {
  let cleanWeather = null;
  if (weather) {
    cleanWeather = {
      name: weather.name,
      coord: weather.coord,
      main: {
        temp: weather.main?.temp,
        humidity: weather.main?.humidity,
        feels_like: weather.main?.feels_like
      },
      weather: weather.weather?.map(w => ({
        main: w.main,
        description: w.description,
        icon: w.icon
      })) || [],
      wind: {
        speed: weather.wind?.speed
      }
    };
  }

  let cleanAQI = null;
  if (aqi && aqi.list && aqi.list[0]) {
    const first = aqi.list[0];
    cleanAQI = {
      list: [{
        main: { aqi: first.main?.aqi },
        components: {
          pm2_5: first.components?.pm2_5,
          pm10: first.components?.pm10
        }
      }]
    };
  }

  let cleanForecast = null;
  if (forecast && forecast.list) {
    cleanForecast = {
      list: forecast.list.map(item => ({
        dt_txt: item.dt_txt,
        main: {
          temp: item.main?.temp,
          humidity: item.main?.humidity
        },
        weather: item.weather?.map(w => ({
          main: w.main,
          description: w.description
        })) || [],
        wind: {
          speed: item.wind?.speed
        },
        pop: item.pop
      }))
    };
  }

  return { cleanWeather, cleanAQI, cleanForecast };
};

// ─── Visual data builder ──────────────────────────────────────────────────────
/**
 * Server-side Multimodal Visual Data Synthesis Module
 */
const buildVisualData = (weatherData, airQualityData, forecastData, intent) => {
  const weekly = getWeeklyForecast(forecastData?.list) || [];
  const hourly = getHourlyForecast(forecastData?.list) || [];
  const aqi = getAQISummary(airQualityData) || { aqiValue: 1, label: 'Good', suggestion: 'Air quality is nominal.' };

  // 1. Forecast Card projection array
  const forecast = weekly.map(item => ({
    day: item.day,
    tempMin: item.tempMin,
    tempMax: item.tempMax,
    condition: item.condition
  }));

  // 2. Hourly Temperature Trend coordinates
  const hourlyTemps = hourly.map(item => ({
    time: item.time,
    temp: item.temp
  }));

  // 3. Rainfall probability array
  const rainChance = hourly.map(item => ({
    time: item.time,
    chance: item.rainChance
  }));

  const condition = weatherData?.weather?.[0]?.main || 'Clear';
  const weatherIcon = weatherData?.weather?.[0]?.icon || '01d';

  // 4. Custom Climate Directive Insights based on live telemetry metrics
  const tempVal = weatherData?.main?.temp !== undefined ? Math.round(weatherData.main.temp) : 22;
  const windVal = weatherData?.wind?.speed !== undefined ? weatherData.wind.speed : 4.5;
  const humidityVal = weatherData?.main?.humidity !== undefined ? weatherData.main.humidity : 55;

  const insights = {
    travelSafety: tempVal > 38 || aqi.aqiValue >= 4
      ? `Conditions are tough right now. With temperatures at ${tempVal}°C and AQI in the ${aqi.label} category, it's best to minimize outdoor exposure and time your travel carefully.`
      : `Travel conditions look good. Wind is calm at ${windVal} m/s, making commuting comfortable and safe.`,
    outdoorRecommendation: aqi.aqiValue >= 3
      ? `Air quality is ${aqi.label} right now. It's better to skip intense outdoor workouts and opt for indoor activities instead.`
      : `Conditions are great for outdoor activities. The air is clean and temperature is comfortable — a perfect time to head outside.`,
    healthAdvisory: aqi.aqiValue >= 4
      ? `Air quality is poor. Wearing a mask outdoors is strongly recommended, especially for children and those with respiratory conditions.`
      : `Air quality is ${aqi.label}. Breathing conditions are safe and no special precautions are needed.`,
    clothingSuggestion: tempVal > 30
      ? `It's hot outside at ${tempVal}°C. Go for lightweight, breathable clothing and stay hydrated throughout the day.`
      : tempVal < 15
        ? `It's cool at ${tempVal}°C. A warm jacket or layered clothing is a good idea before heading out.`
        : `The temperature is a comfortable ${tempVal}°C. Light, casual clothing should work perfectly.`,
    rainRisk: condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('drizzle')
      ? `Rain is expected. An umbrella or rain jacket is highly recommended before you head out.`
      : `No rain expected. With humidity at ${humidityVal}%, skies should remain mostly clear.`
  };

  return {
    temp: tempVal,
    humidity: humidityVal,
    windSpeed: windVal,
    forecast,
    hourlyTemps,
    rainChance,
    AQI: aqi,
    weatherIcon,
    condition,
    charts: {
      activeChart: intent.topic // 'rain', 'aqi', 'temperature', 'humidity', 'wind', etc.
    },
    insights
  };
};

// ─── Normalized response builder ──────────────────────────────────────────────
/**
 * Builds the normalized AI response object that ALL providers must return.
 * Both `reply` and `response` are always populated to support Travel.jsx,
 * Planner.jsx, and the Assistant — which may read either field.
 */
const buildResponse = (text, modelName, fallbackTriggered, visualData) => ({
  success: true,
  reply: text,
  response: text,
  modelUsed: modelName,
  fallbackTriggered,
  visualData
});

const buildFailureResponse = (text, modelName, visualData) => ({
  success: false,
  reply: text,
  response: text,
  modelUsed: modelName,
  fallbackTriggered: true,
  visualData
});

// ─── Main AI chat handler ─────────────────────────────────────────────────────
/**
 * Handle direct AI requests from the frontend using backend environment secrets.
 * Implements the 5-tier fallback cascade:
 *   1. Gemini 2.5 Flash (8s)
 *   2. Gemini 2.5 Flash-Lite (5s)
 *   3. Gemini 2.0 Flash (6s)
 *   4. OpenRouter (12s)
 *   5. Local heuristic fallback (always succeeds)
 */
export const handleAIChat = async (message, weatherData, airQualityData, forecastData) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  // Optimize telemetry data size to minimize context tokens and server memory
  const { cleanWeather, cleanAQI, cleanForecast } = optimizeTelemetryPayload(weatherData, airQualityData, forecastData);

  // A. Classification of user intent & city mention extraction
  const intent = detectUserIntent(message);
  const extractedCity = extractCity(message);
  logger.info(`[INTENT DETECTION] Query: "${message.substring(0, 50)}..." -> Topic: ${intent.topic}, Future: ${intent.isFuture}`);

  let targetWeather = cleanWeather;
  let targetAirQuality = cleanAQI;
  let targetForecast = cleanForecast;

  // B. Dynamic City Matching on Backend
  if (extractedCity && (!weatherData || !weatherData.name || extractedCity.toLowerCase() !== weatherData.name.toLowerCase())) {
    try {
      logger.info(`[DYNAMIC RESOLUTION] Different location mentioned: "${extractedCity}". Querying backend weather metrics...`);
      const report = await getFullWeatherReport(null, null, extractedCity);

      targetWeather = {
        name: report.location.name,
        coord: { lat: report.location.lat, lon: report.location.lon },
        main: {
          temp: report.currentWeather.temp,
          humidity: report.currentWeather.humidity
        },
        weather: [{
          main: report.currentWeather.precipitation > 0 ? 'Rain' : 'Clear',
          description: report.currentWeather.precipitation > 0 ? 'rainy' : 'clear sky'
        }],
        wind: {
          speed: report.currentWeather.windSpeed
        }
      };

      const daily = report.forecast.daily;
      const synthesizedList = [];
      if (daily && daily.time) {
        for (let i = 0; i < daily.time.length; i++) {
          synthesizedList.push({
            dt_txt: `${daily.time[i]} 12:00:00`,
            main: {
              temp: daily.temperature_2m_max[i],
              humidity: 60
            },
            weather: [{
              main: daily.weather_code[i] > 50 ? 'Rain' : 'Clear',
              description: daily.weather_code[i] > 50 ? 'rainy' : 'clear sky'
            }],
            wind: { speed: 2.5 },
            pop: (daily.precipitation_probability_max[i] || 0) / 100
          });
        }
      }

      targetForecast = { list: synthesizedList };
      targetAirQuality = report.airQuality;
      logger.info(`[DYNAMIC RESOLUTION SUCCESS] Resolved telemetry for "${extractedCity}".`);
    } catch (err) {
      logger.warn(`[DYNAMIC RESOLUTION FAILED] Error for "${extractedCity}". Using passed context. Error: ${err.message}`);
    }
  }

  // C. Synthesize Visual Telemetry Data block
  const visualData = buildVisualData(targetWeather, targetAirQuality, targetForecast, intent);

  // D. Future intent data guard
  if (intent.isFuture && (!targetForecast || !targetForecast.list || targetForecast.list.length === 0)) {
    logger.warn('[RULE ENGINE] Future query but forecast data missing. Returning stable error.');
    return buildFailureResponse(
      'Forecast data is currently unavailable. Please try again later.',
      'rule-engine-check',
      visualData
    );
  }

  // E. Gemini API key guard — skip Gemini cascade entirely, go to OpenRouter
  if (!geminiKey) {
    logger.error('[SECURITY ERROR] GEMINI_API_KEY missing from backend environment!');
    // Don't return immediately — fall through to OpenRouter / local fallback below
  }

  // F. Prompt Synthesis
  const systemPrompt = getSystemPrompt(targetWeather, targetAirQuality, targetForecast, intent);
  const isJsonRequested = /return only.*json|valid json|json object/i.test(message);
  const jsonDirective = isJsonRequested
    ? '\n\nCRITICAL INSTRUCTION: The user has requested a structured JSON response. You MUST return ONLY the raw, valid JSON object matching the requested schema. Do NOT include conversational text, preamble, explanation, or markdown backticks.'
    : '';
  const fullPrompt = `${systemPrompt}${jsonDirective}\n\nUser Question: ${message}`;

  // ── G. Gemini Cascade ──────────────────────────────────────────────────────
  if (geminiKey) {
    for (const model of MODEL_CONFIGS) {
      const t0 = Date.now();
      try {
        logger.info(`[AI] ${model.name} -> attempting...`);

        const response = await axios.post(
          model.endpoint(geminiKey),
          { contents: [{ parts: [{ text: fullPrompt }] }] },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: model.timeout
          }
        );

        const elapsed = Date.now() - t0;
        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiText) {
          logger.info(`[AI] ${model.name} -> ${elapsed}ms -> SUCCESS`);
          return buildResponse(aiText.trim(), model.name, false, visualData);
        }

        throw new Error(`Empty candidate payload from ${model.name}`);

      } catch (error) {
        const elapsed = Date.now() - t0;
        const status = error.response?.status;
        const retriable = isRetriableError(error);

        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          logger.error(`[AI] ${model.name} -> ${elapsed}ms -> TIMEOUT`);
        } else {
          logger.error(`[AI] ${model.name} -> ${elapsed}ms -> FAIL (HTTP ${status || 'N/A'}): ${error.message}`);
        }

        if (!retriable) {
          // Non-retriable (e.g. 401, 403, 400): break Gemini cascade, skip to OpenRouter
          logger.warn(`[AI] ${model.name} -> Non-retriable error (HTTP ${status}). Breaking Gemini cascade.`);
          break;
        }
        // Retriable: continue to next Gemini model
      }
    }
  }

  // ── H. OpenRouter Secondary Fallback ──────────────────────────────────────
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = OPENROUTER_CONFIG.getModel();

  if (openRouterKey) {
    const t0 = Date.now();
    try {
      logger.info(`[AI] OpenRouter (${openRouterModel}) -> attempting...`);

      const orResponse = await axios.post(
        OPENROUTER_CONFIG.endpoint,
        {
          model: openRouterModel,
          messages: [{ role: 'user', content: fullPrompt }]
        },
        {
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.FRONTEND_URL || 'https://atmosiq.app',
            'X-Title': 'AtmosIQ'
          },
          timeout: OPENROUTER_CONFIG.timeout
        }
      );

      const elapsed = Date.now() - t0;
      const orText = orResponse.data?.choices?.[0]?.message?.content;

      if (orText) {
        logger.info(`[AI] OpenRouter (${openRouterModel}) -> ${elapsed}ms -> SUCCESS`);
        return buildResponse(orText.trim(), `openrouter/${openRouterModel}`, true, visualData);
      }

      throw new Error('OpenRouter returned empty or malformed response.');

    } catch (orError) {
      const elapsed = Date.now() - t0;
      const orStatus = orError.response?.status;
      // Safe log: never print the key, only status + sanitized error message
      logger.error(`[AI] OpenRouter -> ${elapsed}ms -> FAIL (HTTP ${orStatus || 'N/A'}): ${orError.response?.data?.error?.message || orError.message}`);
    }
  } else {
    logger.warn('[AI] OPENROUTER_API_KEY not set. Skipping OpenRouter.');
  }

  // ── I. Local Heuristic Fallback (always succeeds) ─────────────────────────
  logger.warn('[AI] All remote providers failed. Activating local heuristic fallback engine.');
  const localResponse = fallbackLogic(message, targetWeather, targetAirQuality, targetForecast, intent);
  return buildFailureResponse(localResponse, 'local-heuristic-fallback', visualData);
};

// ─── Internal AI wrapper ──────────────────────────────────────────────────────
/**
 * Legacy/Internal AI generation wrapper (used by backend weather analyzer for insights).
 */
export const generateAIResponse = async (prompt) => {
  try {
    logger.info('[INTERNAL AI] Routing internal prompt through cascading router.');
    const result = await handleAIChat(prompt, {}, {}, { list: [] });

    const text = result.response;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (jsonErr) {
        logger.warn(`[INTERNAL AI] JSON parse failed, returning raw text. Error: ${jsonErr.message}`);
      }
    }

    return text;
  } catch (error) {
    logger.error(`[INTERNAL AI] Failed: ${error.message}`);
    throw new ApiError(500, 'Internal AI Engine failed to process request');
  }
};
