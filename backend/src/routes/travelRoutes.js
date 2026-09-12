import express from 'express';
import { checkTravelSafety } from '../controllers/travelController.js';

const router = express.Router();

router.post('/check', checkTravelSafety);

export default router;
