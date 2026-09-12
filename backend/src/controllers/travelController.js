import { catchAsync, ApiError } from '../middleware/errorMiddleware.js';
import { getFullWeatherReport } from '../services/weather/weatherService.js';

/**
 * Assess travel route weather safety between source and destination
 */
export const checkTravelSafety = catchAsync(async (req, res) => {
  const { source, destination, date } = req.body;

  if (!source || !destination || !date) {
    throw new ApiError(400, 'Source, destination, and date are required');
  }

  // 1. Fetch live weather reports for both locations in parallel
  const [sourceReport, destReport] = await Promise.all([
    getFullWeatherReport(null, null, source),
    getFullWeatherReport(null, null, destination)
  ]);

  // 2. Synthesize route risk assessment
  const destAlerts = destReport.alerts || [];
  const hasSevereRisk = destAlerts.some(a => a.severity === 'HIGH');
  const hasModerateRisk = destAlerts.some(a => a.severity === 'MEDIUM');

  let decision = 'GO';
  let reasoning = `Weather conditions in ${destReport.location.name} are favorable for travel on ${date}.`;

  if (hasSevereRisk) {
    decision = 'AVOID';
    reasoning = `Severe weather detected in ${destReport.location.name}: ${destAlerts.map(a => a.message).join(' ')}`;
  } else if (hasModerateRisk) {
    decision = 'CAUTION';
    reasoning = `Caution advised in ${destReport.location.name}: ${destAlerts.map(a => a.message).join(' ')}`;
  }

  res.status(200).json({
    success: true,
    data: {
      decision,
      reasoning,
      travelDate: date,
      origin: {
        location: sourceReport.location.name,
        temp: sourceReport.currentWeather.temp,
        humidity: sourceReport.currentWeather.humidity,
        windSpeed: sourceReport.currentWeather.windSpeed,
        alerts: sourceReport.alerts
      },
      destination: {
        location: destReport.location.name,
        temp: destReport.currentWeather.temp,
        humidity: destReport.currentWeather.humidity,
        windSpeed: destReport.currentWeather.windSpeed,
        alerts: destReport.alerts
      }
    }
  });
});
