import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import rateLimit from 'express-rate-limit';

import logger from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// 1. Logging Middleware
app.use(pino({ logger }));

// 2. Security & CORS Configuration
app.use(helmet());

const staticOrigins = [
  'https://atmos-iq-chi.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const localDevOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1):(5173|5174|5175|3000|4173)$/;
const vercelPreviewRegex = /^https:\/\/atmos-iq.*\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, mobile native)
    if (!origin) return callback(null, true);

    if (
      staticOrigins.includes(origin) ||
      localDevOriginRegex.test(origin) ||
      vercelPreviewRegex.test(origin)
    ) {
      return callback(null, true);
    }

    logger.warn(`[CORS REJECTED] Origin not permitted: ${origin}`);
    return callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 3. Body Parsers
app.use(express.json({ limit: '10mb' })); // Support large weather payloads safely
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 4. Compression
app.use(compression());

// 5. Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 6. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/travel', travelRoutes);
app.use('/api/v1/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 7. Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
