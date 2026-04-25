import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  campus: { type: String, required: true },
  year: { type: String, required: true },
  role: { type: String, default: "user" },
  gameStats: {
    "Quiz Battle": { wins: { type: Number, default: 0 }, points: { type: Number, default: 0 } },
    "Typing Speed": { wins: { type: Number, default: 0 }, points: { type: Number, default: 0 } },
    "Coding Arena": { wins: { type: Number, default: 0 }, points: { type: Number, default: 0 } },
    "Memory Match": { wins: { type: Number, default: 0 }, points: { type: Number, default: 0 } }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
