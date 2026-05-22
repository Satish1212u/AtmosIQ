import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'STORM', 'HEATWAVE', 'POLLUTION'
  location: {
    name: String,
    lat: Number,
    lon: Number
  },
  message: { type: String, required: true },
  severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'INFO' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
