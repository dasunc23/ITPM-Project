import Room from '../models/roomModel.js';

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

    const roomCode = await generateRoomCode();

    const room = new Room({
      roomCode,
      hostId: userId,
      gameType,
      players: [{ userId, username, isHost: true }],
      lastActivity: Date.now()
    });

    await room.save();

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

    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Game already started. Cannot join now' });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ message: 'Room is full (max 6 players)' });
    }

    const alreadyJoined = room.players.find(p => p.userId.toString() === userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You are already in this room' });
    }

    room.players.push({ userId, username, isHost: false });
    room.lastActivity = Date.now();
    await room.save();

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

// ─── 4. LEAVE ROOM ───────────────────────────────
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

    res.status(200).json({ message: 'Left room successfully', room });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── 5. START GAME ───────────────────────────────
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

    if (room.players.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 players to start' });
    }

    room.status = 'in-progress';
    room.lastActivity = Date.now();
    await room.save();

    res.status(200).json({ message: 'Game started!', room });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createRoom, joinRoom, getRoom, leaveRoom, startGame };