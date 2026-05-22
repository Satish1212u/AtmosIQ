import express from 'express';
import { getWeather, getWeatherAI } from '../controllers/weatherController.js';
import { validate, weatherSchemas } from '../middleware/validateMiddleware.js';

const router = express.Router();

// General weather report (Current + Forecast + AQI + AI)
router.get('/', validate(weatherSchemas.getWeather), getWeather);

// AI-focused environmental insights
router.get('/intelligence', validate(weatherSchemas.getWeather), getWeatherAI);

export default router;
