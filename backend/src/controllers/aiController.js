import { getFullWeatherReport } from '../services/weather/weatherService.js';
import { catchAsync } from '../middleware/errorMiddleware.js';
import { handleAIChat } from '../services/aiService.js';

/**
 * Handle weather intelligence requests
 * Redirects to the main weather report orchestrator
 */
export const getWeatherIntelligence = catchAsync(async (req, res) => {
  const { lat, lon, city } = req.query;

  const latitude = lat ? parseFloat(lat) : null;
  const longitude = lon ? parseFloat(lon) : null;

  const report = await getFullWeatherReport(latitude, longitude, city);

  res.status(200).json({
    status: 'success',
    data: {
      location: report.location.name,
      telemetry: report.currentWeather,
      forecast: report.forecast.daily,
      intelligence: report.aiInsights,
      alerts: report.alerts
    }
  });
});

/**
 * Handle travel safety analysis specifically
 */
export const getTravelAnalysis = catchAsync(async (req, res) => {
  const { originLat, originLon, destLat, destLon, originCity, destCity, date } = req.body;

  const [originReport, destReport] = await Promise.all([
    getFullWeatherReport(originLat, originLon, originCity),
    getFullWeatherReport(destLat, destLon, destCity)
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      origin: originReport,
      destination: destReport,
      analysisDate: date
    }
  });
});

/**
 * Handle conversational AI chat requests.
 *
 * Response contract — always returns both fields so Travel.jsx, Planner.jsx,
 * and the Assistant can read whichever field they prefer:
 * {
 *   success: boolean,
 *   reply: string,          // primary field used by frontend aiApi.js
 *   response: string,       // alias kept for backward-compatibility
 *   modelUsed: string,
 *   fallbackTriggered: boolean,
 *   visualData: object
 * }
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, weatherData, airQualityData, forecastData } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const aiResponse = await handleAIChat(
      message,
      weatherData,
      airQualityData,
      forecastData
    );

    // aiService always returns { success, reply, response, modelUsed, fallbackTriggered, visualData }
    return res.status(200).json({
      success: aiResponse.success,
      reply: aiResponse.reply,
      response: aiResponse.response,
      modelUsed: aiResponse.modelUsed,
      fallbackTriggered: aiResponse.fallbackTriggered,
      visualData: aiResponse.visualData
    });

  } catch (error) {
    console.error('[AI CONTROLLER] Unhandled crash:', error.message);
    return res.status(500).json({
      success: false,
      reply: 'AI generation failed. Please try again.',
      response: 'AI generation failed. Please try again.',
      modelUsed: 'error',
      fallbackTriggered: true,
      message: error.message
    });
  }
};