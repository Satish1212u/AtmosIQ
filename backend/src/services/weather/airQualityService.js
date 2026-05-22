import axios from 'axios';
import logger from '../../utils/logger.js';
import { ApiError } from '../../middleware/errorMiddleware.js';

/**
 * Air Quality Service using AQICN API
 */
export const getAirQuality = async (lat, lon) => {
  const token = process.env.AQICN_TOKEN || 'demo';
  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

  try {
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data.status !== 'ok') {
      logger.warn('AQICN returned non-ok status, using fallback data');
      return null;
    }

    const { aqi, dominentpol, iaqi, city, time } = response.data.data;
    
    return {
      aqi,
      mainPollutant: dominentpol,
      details: iaqi,
      station: city.name,
      updatedAt: time.s
    };
  } catch (error) {
    logger.error(`AQI Service Error: ${error.message}`);
    // Non-critical, return null to allow weather service to continue
    return null;
  }
};
