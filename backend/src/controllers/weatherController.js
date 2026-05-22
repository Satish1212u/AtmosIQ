import { getFullWeatherReport } from '../services/weather/weatherService.js';
import { catchAsync } from '../middleware/errorMiddleware.js';

/**
 * Get comprehensive weather report
 * Supports lat/lon or city query params
 */
export const getWeather = catchAsync(async (req, res) => {
  const { lat, lon } = req.query;
  const city = req.params.city || req.query.city;

  const latitude = lat ? parseFloat(lat) : null;
  const longitude = lon ? parseFloat(lon) : null;

  const report = await getFullWeatherReport(latitude, longitude, city);

  res.status(200).json(report);
});

/**
 * Specific route for AI-only analysis (if needed)
 */
export const getWeatherAI = catchAsync(async (req, res) => {
  const { lat, lon, city } = req.query;
  
  const latitude = lat ? parseFloat(lat) : null;
  const longitude = lon ? parseFloat(lon) : null;

  const report = await getFullWeatherReport(latitude, longitude, city);

  res.status(200).json({
    success: true,
    location: report.location.name,
    aiInsights: report.aiInsights,
    alerts: report.alerts
  });
});
