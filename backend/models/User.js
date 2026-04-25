import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  campus: { type: String, required: true },
  year: { type: String, required: true },
  role: { type: String, default: "user" },
  freeGamePlays: { type: Number, default: 0, min: 0 },
  hasPaidGameAccess: { type: Boolean, default: false },
  gameAccessPaidAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
