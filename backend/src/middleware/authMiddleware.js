import jwt from 'jsonwebtoken';
import { ApiError, catchAsync } from './errorMiddleware.js';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes - ensures user is logged in
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, please login to access this resource');
  }

  // 1. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    
    // 2. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new ApiError(401, 'The user belonging to this token no longer exists');
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
});

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }
    next();
  };
};
