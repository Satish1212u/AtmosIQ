import axios from 'axios';
import logger from '../../utils/logger.js';
import { ApiError } from '../../middleware/errorMiddleware.js';

/**
 * Geocoding Service using Open-Meteo Free Geocoding API
 */
export const geocodeCity = async (city) => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (!response.data.results || response.data.results.length === 0) {
      throw new ApiError(404, `City "${city}" not found`);
    }

    const { latitude, longitude, name, country, admin1 } = response.data.results[0];
    
    return {
      lat: latitude,
      lon: longitude,
      name,
      country,
      region: admin1
    };
  } catch (error) {
    logger.error(`Geocoding Error: ${error.message}`);
    if (error instanceof ApiError) throw error;
    throw new ApiError(503, 'Geocoding service is currently unreachable');
  }
};
