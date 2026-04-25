import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  badge: { type: String, required: true },
  earnedBy: { type: String, required: true }, // Store the username directly for simplicity
  earnedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Achievement', achievementSchema);
