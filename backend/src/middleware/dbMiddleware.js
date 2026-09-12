import { isDbConnected } from '../config/db.js';

/**
 * Middleware to ensure MongoDB is available before running database-dependent routes.
 * Fails fast with HTTP 503 instead of buffering or timing out.
 */
export const requireDb = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please try again later.'
    });
  }
  next();
};
