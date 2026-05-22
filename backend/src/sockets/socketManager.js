import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  // Authentication Middleware for Sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 User connected: ${socket.user.id} (${socket.id})`);

    // Dynamic room joining based on location for localized alerts
    socket.on('subscribe_weather', (locationId) => {
      socket.join(`weather_${locationId}`);
      logger.info(`📍 User ${socket.user.id} subscribed to location: ${locationId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`👋 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

/**
 * Broadcast severe weather alerts to specific location rooms
 */
export const broadcastAlert = (locationId, alertData) => {
  if (io) {
    io.to(`weather_${locationId}`).emit('severe_alert', {
      ...alertData,
      timestamp: new Date()
    });
    logger.info(`📢 Broadcasted alert to room: weather_${locationId}`);
  }
};
