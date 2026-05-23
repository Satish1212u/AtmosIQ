import axios from 'axios';
import logger from '../utils/logger.js';
import { MODEL_CONFIGS } from '../config/aiModels.js';
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

/**
 * Handle direct AI requests from the frontend using backend environment secrets
 */
export const handleAIChat = async (message, weatherData, airQualityData, forecastData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Optimize telemetry data size immediately to minimize context tokens and server memory footprint
  const { cleanWeather, cleanAQI, cleanForecast } = optimizeTelemetryPayload(weatherData, airQualityData, forecastData);

  // A. Classification of user intent & city mention extraction
  const intent = detectUserIntent(message);
  const extractedCity = extractCity(message);
  logger.info(`[INTENT DETECTION] Classifying query: "${message.substring(0, 40)}..." -> Topic: ${intent.topic}, Future: ${intent.isFuture}`);

  let targetWeather = cleanWeather;
  let targetAirQuality = cleanAQI;
  let targetForecast = cleanForecast;

  // B. Dynamic City Matching on Backend
  if (extractedCity && (!weatherData || !weatherData.name || extractedCity.toLowerCase() !== weatherData.name.toLowerCase())) {
    try {
      logger.info(`[DYNAMIC RESOLUTION] Mentions different location: "${extractedCity}". Querying backend weather metrics...`);
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
            wind: {
              speed: 2.5
            },
            pop: (daily.precipitation_probability_max[i] || 0) / 100
          });
        }
      }

      targetForecast = { list: synthesizedList };
      targetAirQuality = report.airQuality;
      logger.info(`[DYNAMIC RESOLUTION SUCCESS] Resolved telemetry context for "${extractedCity}" successfully.`);
    } catch (err) {
      logger.warn(`[DYNAMIC RESOLUTION FAILED] Error loading report for "${extractedCity}". Falling back to passed context. Error: ${err.message}`);
    }
  }

  // C. Synthesize Visual Telemetry Data block
  const visualData = buildVisualData(targetWeather, targetAirQuality, targetForecast, intent);

  // D. Check future intent data constraints
  if (intent.isFuture && (!targetForecast || !targetForecast.list || targetForecast.list.length === 0)) {
    logger.warn('[RULE ENGINE] Future query detected but forecast list is missing. Returning stable error.');
    return {
      success: false,
      modelUsed: 'rule-engine-check',
      response: "Forecast data is currently unavailable. Please try again later.",
      fallbackTriggered: true,
      visualData
    };
  }

  // E. API Key checks
  if (!apiKey) {
    logger.error('[SECURITY ERROR] GEMINI_API_KEY missing from backend environment variables!');
    const fallbackResponse = fallbackLogic(message, targetWeather, targetAirQuality, targetForecast, intent);
    return {
      success: false,
      modelUsed: 'local-fallback-no-key',
      response: fallbackResponse,
      fallbackTriggered: true,
      visualData
    };
  }

  // F. Prompt Synthesis
  const systemPrompt = getSystemPrompt(targetWeather, targetAirQuality, targetForecast, intent);
  const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

  // G. Fallback Cascade Loop
  let fallbackTriggered = false;
  for (const model of MODEL_CONFIGS) {
    try {
      logger.info(`[MODEL GATEWAY] Activating: ${model.name}`);

      const endpoint = model.endpoint(apiKey);
      const payload = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      };

      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: model.timeout
      });

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        logger.info(`[GATEWAY SUCCESS] Response generated using model ${model.name}`);
        return {
          success: true,
          modelUsed: model.name,
          response: aiText.trim(),
          fallbackTriggered,
          visualData
        };
      } else {
        throw new Error(`Invalid or empty candidate output payload from model: ${model.name}`);
      }
    } catch (error) {
      fallbackTriggered = true;
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        logger.error(`[TIMEOUT EVENT] request timed out for model: ${model.name}`);
      } else {
        logger.error(`[REQUEST FAILURE] Model error for ${model.name}: ${error.message}`);
      }
    }
  }

  // H. Final offline/failure local generator fallback
  logger.warn('[FALLBACK TRIGGERED] All remote LLM models failed or timed out. Triggering native local engine.');
  const finalLocalResponse = fallbackLogic(message, targetWeather, targetAirQuality, targetForecast, intent);
  return {
    success: false,
    modelUsed: 'local-fallback-failure',
    response: finalLocalResponse,
    fallbackTriggered: true,
    visualData
  };
};

/**
 * Legacy/Internal AI generation wrapper (used by backend weather analyzer for insights)
 */
export const generateAIResponse = async (prompt) => {
  try {
    logger.info('[INTERNAL AI RESPONSE] Routing internal prompt into secured cascading router.');
    const result = await handleAIChat(prompt, {}, {}, { list: [] });
    
    const text = result.response;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (jsonErr) {
        logger.warn(`[JSON PARSE FAILED] Falling back to raw text. Error: ${jsonErr.message}`);
      }
    }
    
    return text;
  } catch (error) {
    logger.error(`[INTERNAL AI ERROR] Failed: ${error.message}`);
    throw new ApiError(500, 'Internal AI Engine failed to process request');
  }
};
