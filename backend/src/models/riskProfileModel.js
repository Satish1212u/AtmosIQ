import mongoose from 'mongoose';

const riskProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  behavioralPatterns: {
    typingSpeed: Number,
    mouseMovementEntropy: Number,
    scrollSpeed: Number
  },
  geolocation: {
    country: String,
    city: String,
    isProxy: { type: Boolean, default: false }
  },
  aiRiskScore: { type: Number, default: 0 },
  trustLevel: { type: String, enum: ['TRUSTED', 'NEUTRAL', 'SUSPICIOUS'], default: 'NEUTRAL' },
  anomaliesDetected: [{
    type: String,
    severity: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const RiskProfile = mongoose.model('RiskProfile', riskProfileSchema);
export default RiskProfile;
