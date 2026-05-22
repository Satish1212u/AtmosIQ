import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Simple in-memory cache: key → { imageUrl, photographer, unsplashLink }
const cache = new Map();

/**
 * Fetch a real city image through the secure backend proxy.
 * The Unsplash API key NEVER leaves the server.
 *
 * @param {string} city      - City name e.g. "Delhi"
 * @param {string} weather   - Weather condition e.g. "rain", "clear"
 * @param {boolean} isNight  - Is it currently night-time?
 * @param {string} country   - Optional country code e.g. "IN"
 * @returns {Promise<{ imageUrl, photographer, unsplashLink } | null>}
 */
export const fetchCityImageUrl = async (city, weather = 'clear', isNight = false, country = '') => {
  if (!city) return null;

  const cacheKey = `${city}::${weather}::${isNight}`.toLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const { data } = await axios.get(`${BASE_URL}/city-image`, {
      params: { city, weather, isNight: String(isNight), country },
      timeout: 10000,
    });

    if (!data.success || !data.imageUrl) return null;

    const result = {
      imageUrl: data.imageUrl,
      photographer: data.photographer || 'Unsplash',
      unsplashLink: data.unsplashLink || 'https://unsplash.com',
    };

    cache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
};
