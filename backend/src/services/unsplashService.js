import axios from 'axios';
import logger from '../utils/logger.js';

// ── In-memory cache: key = "city::condition::isNight" → { imageUrl, photographer, unsplashLink, cachedAt }
const imageCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Build an intelligent Unsplash search query tuned for cinematic cityscape imagery.
 */
const buildSearchQuery = (city, weather, isNight) => {
  const w = (weather || 'clear').toLowerCase();

  if (isNight)                                        return `${city} city night skyline`;
  if (w.includes('thunderstorm') || w.includes('thunder')) return `${city} storm clouds dramatic`;
  if (w.includes('snow') || w.includes('blizzard'))   return `${city} snowfall winter city`;
  if (w.includes('fog') || w.includes('haze') || w.includes('mist')) return `${city} foggy cityscape`;
  if (w.includes('rain') || w.includes('drizzle'))    return `${city} rainy street cityscape`;
  if (w.includes('cloud'))                            return `${city} cloudy city skyline`;
  if (w.includes('clear') || w.includes('sun'))       return `${city} sunny skyline`;
  return `${city} city skyline`;
};

/**
 * Fetch a real city image from Unsplash.
 * Returns { imageUrl, photographer, unsplashLink } or null on failure.
 */
export const fetchCityImage = async (city, weather = 'clear', isNight = false, country = '') => {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    logger.warn('[Unsplash] UNSPLASH_ACCESS_KEY not set — skipping image fetch');
    return null;
  }

  const cacheKey = `${city}::${weather}::${isNight}`.toLowerCase();

  // Return cached result if fresh
  if (imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      logger.info(`[Unsplash] Cache HIT for "${cacheKey}"`);
      return cached;
    }
    imageCache.delete(cacheKey);
  }

  const query = buildSearchQuery(city, weather, isNight);
  logger.info(`[Unsplash] Fetching image for query: "${query}"`);

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 10,
        orientation: 'landscape',
        content_filter: 'high',
        order_by: 'relevant',
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      timeout: 8000,
    });

    const results = response.data?.results || [];

    if (results.length === 0) {
      logger.warn(`[Unsplash] No results for query: "${query}"`);
      return null;
    }

    // Pick the best result: prefer wider/landscape images with higher resolution
    // Score by: resolution × aspect ratio (wider = higher score)
    const scored = results.map((photo) => {
      const w = photo.width || 1;
      const h = photo.height || 1;
      const ratio = w / h;
      const resolution = w * h;
      return { photo, score: ratio * resolution };
    });
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0].photo;

    // Use the `regular` size for web (1080px wide) — optimised for performance
    const imageUrl = best.urls?.regular || best.urls?.full;
    const photographer = best.user?.name || 'Unknown';
    const unsplashLink = best.links?.html || 'https://unsplash.com';

    const result = { imageUrl, photographer, unsplashLink, cachedAt: Date.now() };
    imageCache.set(cacheKey, result);

    logger.info(`[Unsplash] Image fetched: ${imageUrl}`);
    return result;

  } catch (err) {
    if (err.response?.status === 403) {
      logger.error('[Unsplash] 403 — check UNSPLASH_ACCESS_KEY or rate limit');
    } else if (err.response?.status === 429) {
      logger.warn('[Unsplash] 429 — rate limited. Returning null.');
    } else {
      logger.error(`[Unsplash] Fetch error: ${err.message}`);
    }
    return null;
  }
};
