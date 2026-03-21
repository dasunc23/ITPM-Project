import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  }
});

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: {
    type: [playerSchema],
    default: []
  },
  maxPlayers: {
    type: Number,
    default: 6
  },
  gameType: {
    type: String,
    enum: ['quiz', 'typing', 'memory', 'coding'],
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'finished'],
    default: 'waiting'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);