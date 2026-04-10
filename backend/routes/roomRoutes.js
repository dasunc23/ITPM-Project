import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  startGame,
  getRoomsByHost,
  clearActiveRooms
} from '../controllers/roomController.js';
import { roomSSEHandler } from '../sse/roomSSE.js';

const router = express.Router();

router.post('/create', createRoom);
router.post('/join/:roomCode', joinRoom);
router.get('/host/:userId', getRoomsByHost);
router.get('/:roomCode', getRoom);
router.post('/leave/:roomCode', leaveRoom);
router.post('/start/:roomCode', startGame);
router.get('/stream/:roomCode', roomSSEHandler);
router.post('/clear-active', clearActiveRooms);

export default router;