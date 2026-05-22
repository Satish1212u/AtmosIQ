import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { ApiError, catchAsync } from '../middleware/errorMiddleware.js';

// Helper to generate tokens
const signToken = (payload, secret, expires) => {
  return jwt.sign(payload, secret, { expiresIn: expires });
};

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = signToken({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET, '15m');
  const refreshToken = signToken({ id: user._id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_default', '7d');

  // Set Refresh Token in secure cookie
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Don't include password in response
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    accessToken,
    data: { user }
  });
};

export const registerUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists & password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

export const refreshAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_default');
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

export const logout = (req, res) => {
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
