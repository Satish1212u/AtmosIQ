import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Disable command buffering so operations fail immediately when disconnected
mongoose.set('bufferCommands', false);

export const isDbConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    logger.warn('⚠️ MONGO_URI not provided. Skipping database connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`💾 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}. Running in DB-free mode.`);
  }
};

export default connectDB;
