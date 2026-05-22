import './src/config/env.js';
import { createServer } from 'http';
import mongoose from 'mongoose';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/sockets/socketManager.js';
import logger from './src/utils/logger.js';


const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Initialize Real-time Engine
initSocket(httpServer);

if (process.env.MONGO_URI) {
  connectDB();
} else {
  logger.warn('MongoDB skipped');
}

const server = httpServer.listen(PORT, () => {
  logger.info(`🚀 AtmosIQ Climate Intelligence Core running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown Handling
const shutdown = () => {
  logger.info('🛑 Received shutdown signal. Closing server...');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await mongoose.connection.close();
    logger.info('Database connection closed.');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle Uncaught Exceptions/Rejections
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.stack || err);
  server.close(() => {
    process.exit(1);
  });
});
