import Room from '../models/roomModel.js';
import mongoose from 'mongoose';
import { broadcastToRoom } from '../sse/roomSSE.js';

// ─── Helper: Generate unique 6-char room code ───
const generateRoomCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await Room.findOne({ roomCode: code });
  }

  return code;
};

// ─── 1. CREATE ROOM ───────────────────────────────
const createRoom = async (req, res) => {
  try {
    const { userId, username, gameType } = req.body;

    if (!userId || !username || !gameType) {
      return res.status(400).json({ message: 'userId, username and gameType are required' });
    }

    // Check if the user is already in an active room (waiting or in-progress)
    const existingRoom = await Room.findOne({
      "players.userId": new mongoose.Types.ObjectId(userId),
      status: { $in: ['waiting', 'in-progress'] },
      expiresAt: { $gt: new Date() }
    });

    if (existingRoom) {
      console.log(`[CreateRoom] BLOCKER TRIGGERED: User ${userId} is already in room ${existingRoom.roomCode} (Status: ${existingRoom.status}, Host: ${existingRoom.hostId})`);
      return res.status(400).json({
        message: 'You are already in an active game room. Finish or wait for it to expire before creating a new one.',
        roomCode: existingRoom.roomCode
      });
    }

    console.log(`[CreateRoom] Creating room for userId: ${userId}, username: ${username}`);

    const roomCode = await generateRoomCode();

    const room = new Room({
      roomCode,
      hostId: userId,
      gameType,
      players: [{ userId, username, isHost: true }],
      lastActivity: Date.now()
    });

    await room.save();
    console.log(`[CreateRoom] Room created: ${roomCode} for hostId: ${room.hostId}`);

    res.status(201).json({
      message: 'Room created successfully',
      roomCode: room.roomCode,
      room
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 2. JOIN ROOM ─────────────────────────────────
const joinRoom = async (req, res) => {
  try {
    const { userId, username } = req.body;
    const { roomCode } = req.params;

    if (!userId || !username) {
      return res.status(400).json({ message: 'userId and username are required' });
    }

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found. Check the code and try again' });
    }

    // Check if room has expired
    const expiryTime = room.expiresAt ? new Date(room.expiresAt).getTime() : new Date(room.createdAt).getTime() + 5 * 60 * 1000;
    if (Date.now() > expiryTime) {
      return res.status(400).json({ message: 'This gameroom has expired' });
    }

    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Game already started. Cannot join now' });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full (max 6 players)' });
    }

    // Check if the user is already in another active room
    const existingRoomCheck = await Room.findOne({
      "players.userId": new mongoose.Types.ObjectId(userId),
      roomCode: { $ne: roomCode.toUpperCase() }, // Not this current room
      status: { $in: ['waiting', 'in-progress'] },
      expiresAt: { $gt: new Date() }
    });

    if (existingRoomCheck) {
      console.log(`[JoinRoom] BLOCKER TRIGGERED: User ${userId} is already in room ${existingRoomCheck.roomCode} (Status: ${existingRoomCheck.status}, Host: ${existingRoomCheck.hostId})`);
      return res.status(400).json({
        message: 'You are already in another active game room. Finish it or wait for it to expire.',
        roomCode: existingRoomCheck.roomCode
      });
    }

    const alreadyJoined = room.players.find(p => p.userId.toString() === userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You are already in this room' });
    }

    room.players.push({ userId, username, isHost: false });
    room.lastActivity = Date.now();
    await room.save();

    // Broadcast to all players in the room
    broadcastToRoom(roomCode.toUpperCase(), {
      type: 'player-joined',
      players: room.players
    });

    res.status(200).json({
      message: 'Joined room successfully',
      room
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 3. GET ROOM ──────────────────────────────────
const getRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ room });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 4. LEAVE ROOM ────────────────────────────────
const leaveRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.players = room.players.filter(p => p.userId.toString() !== userId);
    room.lastActivity = Date.now();

    if (room.players.length === 0) {
      await Room.deleteOne({ roomCode: roomCode.toUpperCase() });
      return res.status(200).json({ message: 'Room deleted as no players remain' });
    }

    const hostStillIn = room.players.find(p => p.userId.toString() === room.hostId.toString());
    if (!hostStillIn) {
      room.players[0].isHost = true;
      room.hostId = room.players[0].userId;
    }

    await room.save();

    // Broadcast to all players in the room
    broadcastToRoom(roomCode.toUpperCase(), {
      type: 'player-left',
      players: room.players
    });

    res.status(200).json({ message: 'Left room successfully', room });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 5. START GAME ────────────────────────────────
const startGame = async (req, res) => {
  try {
    const { userId } = req.body;
    const { roomCode } = req.params;

    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.hostId.toString() !== userId) {
      return res.status(403).json({ message: 'Only the host can start the game' });
    }

    // Check if room has expired
    const expiryTime = room.expiresAt ? new Date(room.expiresAt).getTime() : new Date(room.createdAt).getTime() + 5 * 60 * 1000;
    if (Date.now() > expiryTime) {
      return res.status(400).json({ message: 'This gameroom has expired' });
    }

    if (room.players.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 players to start' });
    }

    room.status = 'in-progress';
    room.lastActivity = Date.now();
    // Cancel the 5-min TTL so started rooms don't get deleted
    room.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    await room.save();

    // Broadcast game started to all players
    broadcastToRoom(roomCode.toUpperCase(), {
      type: 'game-started',
      room
    });

    res.status(200).json({ message: 'Game started!', room });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 6. GET ROOMS BY HOST ────────────────────────
const getRoomsByHost = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    console.log(`[getRoomsByHost] Searching for userId: ${userId} in hostId or players.userId`);

    const query = {
      $or: [
        { hostId: new mongoose.Types.ObjectId(userId) },
        { 'players.userId': new mongoose.Types.ObjectId(userId) }
      ],
      status: { $in: ['waiting', 'in-progress'] },
      expiresAt: { $gt: new Date() }
    };

    const rooms = await Room.find(query).sort({ createdAt: -1 }).lean();

    console.log(`[getRoomsByHost] Query returned ${rooms.length} rooms for userId: ${userId}`);
    if (rooms.length > 0) {
      console.log(`[getRoomsByHost] Room IDs: ${rooms.map(r => r.roomCode).join(', ')}`);
    }

    res.status(200).json({ rooms });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 7. CLEAR ALL ACTIVE ROOMS (SAFETY) ─────────
const clearActiveRooms = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    console.log(`[ClearActiveRooms] Clearing all sessions for userId: ${userId}`);

    const rooms = await Room.find({
      "players.userId": new mongoose.Types.ObjectId(userId),
      status: { $in: ['waiting', 'in-progress'] }
    });

    for (const room of rooms) {
      room.players = room.players.filter(p => String(p.userId) !== String(userId));

      if (room.players.length === 0) {
        await Room.deleteOne({ _id: room._id });
      } else {
        // If host left, assign new host
        if (String(room.hostId) === String(userId)) {
          room.players[0].isHost = true;
          room.hostId = room.players[0].userId;
        }
        await room.save();

        broadcastToRoom(room.roomCode, {
          type: 'player-left',
          players: room.players
        });
      }
    }

    res.status(200).json({ message: `Cleared ${rooms.length} sessions.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createRoom, joinRoom, getRoom, leaveRoom, startGame, getRoomsByHost, clearActiveRooms };