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
 * Handle conversational AI chat requests by orchestration with Gemini
 */
export const chatWithAI = async (req, res) => {
  try {

    console.log("AI REQUEST BODY:", req.body);

    const { message, weatherData } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const aiResponse = await handleAIChat(
      message,
      weatherData,
      req.body.airQualityData,
      req.body.forecastData
    );

    return res.status(200).json({
      success: true,
      reply: aiResponse.response,
      visualData: aiResponse.visualData,
      modelUsed: aiResponse.modelUsed
    });

  } catch (error) {

    console.error("AI CONTROLLER CRASH:", error);

    return res.status(500).json({
      success: false,
      message: "AI generation failed",
      error: error.message
    });
  }
};