import express from 'express';
import { checkTravelSafety } from '../controllers/travelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/check', protect, checkTravelSafety);

export default router;
