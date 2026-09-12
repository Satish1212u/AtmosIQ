import express from 'express';
import { registerUser, loginUser, refreshAccessToken, logout } from '../controllers/authController.js';
import { validate, authSchemas } from '../middleware/validateMiddleware.js';
import { requireDb } from '../middleware/dbMiddleware.js';

const router = express.Router();

router.post('/register', requireDb, validate(authSchemas.register), registerUser);
router.post('/login', requireDb, validate(authSchemas.login), loginUser);
router.post('/refresh-token', requireDb, refreshAccessToken);
router.post('/logout', logout);

export default router;
