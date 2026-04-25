import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  startGame,
  getRoomsByHost,
  clearActiveRooms,
  endGame,
  getAllRooms,
  deleteRoom
} from '../controllers/roomController.js';
import { roomSSEHandler } from '../sse/roomSSE.js';

const router = express.Router();

// Admin Routes
router.get('/admin/all', getAllRooms);
router.delete('/admin/:roomCode', deleteRoom);

// Standard Routes
router.post('/create', createRoom);
router.post('/join/:roomCode', joinRoom);
router.get('/host/:userId', getRoomsByHost);
router.get('/stream/:roomCode', roomSSEHandler);  // ← MUST be before /:roomCode
router.get('/:roomCode', getRoom);
router.post('/leave/:roomCode', leaveRoom);
router.post('/start/:roomCode', startGame);
router.post('/end/:roomCode', endGame);
router.post('/clear-active', clearActiveRooms);

export default router;