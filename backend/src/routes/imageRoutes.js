import express from 'express';
import { fetchCityImage } from '../services/unsplashService.js';

const router = express.Router();

/**
 * GET /api/v1/city-image
 *
 * Query params:
 *   city    - required  e.g. "Delhi"
 *   weather - optional  e.g. "rain", "clear"  (default: "clear")
 *   isNight - optional  "true" | "false"       (default: "false")
 *   country - optional  e.g. "IN"
 *
 * Response:
 *   200 { success, city, weather, imageUrl, photographer, unsplashLink }
 *   200 { success: false, fallback: true, reason }   ← graceful fallback
 *   400 { error: "city param required" }
 */
router.get('/', async (req, res) => {
  const { city, weather = 'clear', isNight = 'false', country = '' } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'city query parameter is required' });
  }

  try {
    const result = await fetchCityImage(
      city.trim(),
      weather.trim(),
      isNight === 'true',
      country.trim()
    );

    if (!result) {
      // Graceful fallback — frontend will use its own weather gradient
      return res.status(200).json({
        success: false,
        fallback: true,
        city: city.trim(),
        weather: weather.trim(),
        reason: 'No image found or Unsplash unavailable',
      });
    }

    return res.status(200).json({
      success: true,
      city: city.trim(),
      weather: weather.trim(),
      imageUrl: result.imageUrl,
      photographer: result.photographer,
      unsplashLink: result.unsplashLink,
    });

  } catch (err) {
    return res.status(200).json({
      success: false,
      fallback: true,
      city: city.trim(),
      reason: err.message,
    });
  }
});

export default router;
