import express from 'express';
import rateLimit from 'express-rate-limit';
import { getWeatherIntelligence, getTravelAnalysis, chatWithAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, weatherSchemas } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Production-grade AI endpoint rate limiter to control token costs and protect against abuse
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests to the AtmosIQ AI gateway. Please slow down and try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply AI rate limiter to all AI routes
router.use(aiLimiter);

// Publicly available with rate limiting
router.get('/intelligence', validate(weatherSchemas.getWeather), getWeatherIntelligence);
router.post('/chat', chatWithAI);

// Protected routes
router.post('/travel-analysis', protect, getTravelAnalysis);

export default router;
