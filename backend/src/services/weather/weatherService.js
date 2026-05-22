import axios from 'axios';
import NodeCache from 'node-cache';
import logger from '../../utils/logger.js';
import { ApiError } from '../../middleware/errorMiddleware.js';
import { geocodeCity } from './geocodingService.js';
import { getAirQuality } from './airQualityService.js';
import { detectSevereWeather, getAIWeatherInsights } from './weatherAnalyzer.js';

// Cache for 15 minutes to reduce API calls
const weatherCache = new NodeCache({ stdTTL: 900 });

/**
 * Main Weather Service using Open-Meteo
 */
export const getFullWeatherReport = async (lat, lon, city = null) => {
  let finalLat = lat;
  let finalLon = lon;
  let locationName = city || 'Current Location';

  // 1. Handle Geocoding if city is provided
  if (city && (!lat || !lon)) {
    const geo = await geocodeCity(city);
    finalLat = geo.lat;
    finalLon = geo.lon;
    locationName = `${geo.name}, ${geo.country}`;
  }

  // 2. Check Cache
  const cacheKey = `${finalLat.toFixed(2)}_${finalLon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    logger.info(`📋 Serving weather from cache for ${cacheKey}`);
    return cached;
  }

  try {
    // 3. Fetch Data in Parallel (Open-Meteo & AQICN)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${finalLat}&longitude=${finalLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
    
    const [weatherRes, aqiData] = await Promise.all([
      axios.get(weatherUrl, { timeout: 8000 }),
      getAirQuality(finalLat, finalLon)
    ]);

    const weatherData = weatherRes.data;

    // 4. Intelligent Analysis
    const alerts = detectSevereWeather(weatherData.current, weatherData.daily);
    const aiInsights = await getAIWeatherInsights(weatherData, aqiData);

    const report = {
      success: true,
      location: {
        name: locationName,
        lat: finalLat,
        lon: finalLon,
        timezone: weatherData.timezone
      },
      currentWeather: {
        temp: weatherData.current.temperature_2m,
        feelsLike: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        isDay: !!weatherData.current.is_day,
        weatherCode: weatherData.current.weather_code,
        precipitation: weatherData.current.precipitation
      },
      airQuality: aqiData,
      forecast: {
        daily: weatherData.daily,
        hourly: weatherData.hourly
      },
      alerts,
      aiInsights
    };

    // 5. Store in Cache
    weatherCache.set(cacheKey, report);
    
    return report;
  } catch (error) {
    logger.error(`Weather Service Orchestration Error: ${error.message}`);
    throw new ApiError(503, 'Environmental data retrieval failed. Please try again later.');
  }
};
