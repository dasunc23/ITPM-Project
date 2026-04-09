import express from 'express';
import {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
  startGame
} from '../controllers/roomController.js';
import { roomSSEHandler } from '../sse/roomSSE.js'; 

const router = express.Router();

router.post('/create', createRoom);
router.post('/join/:roomCode', joinRoom);
router.get('/:roomCode', getRoom);
router.post('/leave/:roomCode', leaveRoom);
router.post('/start/:roomCode', startGame);
router.get('/stream/:roomCode', roomSSEHandler);

export default router;