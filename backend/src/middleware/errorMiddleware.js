/**
 * Custom Error class for API related errors
 */
export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Handle unknown routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  // CORS policy rejection
  if (err.message && err.message.includes('CORS policy does not allow access')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  // Database disconnection/buffering failure
  if (err.name === 'MongooseError' || err.message?.includes('buffering timed out') || err.message?.includes('Client must be connected')) {
    return res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please try again later.'
    });
  }

  // Capture native error status, or res status if set, defaulting to 500
  const statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode);

  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Catch async errors and pass to next()
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};