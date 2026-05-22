import { asyncWrapper } from '../middleware/errorMiddleware.js';
import { getWeatherDataByCity } from '../services/weatherService.js';
import { analyzeTravelSafety } from '../services/aiService.js';

export const checkTravelSafety = asyncWrapper(async (req, res) => {
  const { source, destination, date } = req.body;

  if (!source || !destination || !date) {
    res.status(400);
    throw new Error('Source, destination, and date are required');
  }

  // 1. Fetch weather for both locations
  const sourceWeather = await getWeatherDataByCity(source);
  const destWeather = await getWeatherDataByCity(destination);

  // 2. AI Analysis
  const analysis = await analyzeTravelSafety(sourceWeather, destWeather, date);

  res.status(200).json({
    success: true,
    data: analysis
  });
});
