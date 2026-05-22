import { generateAIResponse } from '../aiService.js';
import logger from '../../utils/logger.js';

/**
 * Heuristic-based severe weather detection
 */
export const detectSevereWeather = (current, daily) => {
  const alerts = [];
  
  // Heatwave
  if (current.temperature_2m > 35) {
    alerts.push({ type: 'HEATWAVE', severity: 'HIGH', message: 'Extreme heat detected. Stay hydrated.' });
  }
  
  // Heavy Rain
  if (current.precipitation > 5) {
    alerts.push({ type: 'HEAVY_RAIN', severity: 'MEDIUM', message: 'Heavy rain in progress. Driving visibility may be reduced.' });
  }
  
  // Storm Risk
  if (daily.precipitation_probability_max[0] > 70 && current.wind_speed_10m > 40) {
    alerts.push({ type: 'STORM_RISK', severity: 'HIGH', message: 'High probability of storm conditions.' });
  }

  // Extreme Cold
  if (current.temperature_2m < 0) {
    alerts.push({ type: 'FREEZING', severity: 'MEDIUM', message: 'Freezing temperatures. Beware of black ice.' });
  }

  return alerts;
};

/**
 * Gemini AI powered weather insights
 */
export const getAIWeatherInsights = async (weatherData, aqiData) => {
  const prompt = `
    Analyze this weather and AQI data for a user:
    Weather: ${JSON.stringify(weatherData)}
    AQI: ${JSON.stringify(aqiData)}
    
    Provide a JSON response with:
    1. travel_advice: Safety for commuting/traveling.
    2. health_warnings: Specifically regarding AQI and temperature.
    3. clothing_suggestions: What to wear today based on temperature and rain.
    4. risk_score: 1-100 (100 being extreme danger).
    5. activity_recommendations: Best outdoor/indoor activities.
    
    Respond ONLY with valid JSON.
  `;

  try {
    return await generateAIResponse(prompt);
  } catch (error) {
    logger.error(`AI Weather Insight Error: ${error.message}`);
    return { error: 'Environmental intelligence is currently unavailable.' };
  }
};
