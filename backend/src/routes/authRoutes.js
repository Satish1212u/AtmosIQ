import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logout } from '../controllers/authController.js';
import { validate, authSchemas } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', validate(authSchemas.register), registerUser);
router.post('/login', validate(authSchemas.login), loginUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

export default router;
