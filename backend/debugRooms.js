import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from './models/roomModel.js';

dotenv.config();

const checkRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/itpm_game');
    console.log('Connected to DB');
    
    const rooms = await Room.find();
    console.log(`Total Rooms in DB: ${rooms.length}`);
    rooms.forEach(r => {
      console.log(`- Code: ${r.roomCode}, Status: ${r.status}, Players: ${r.players.length}, ExpiresAt: ${r.expiresAt}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkRooms();
