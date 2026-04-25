import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getLeaderboard,
  updateScore,
  overrideGameStats,
  resetAllLeaderboards
} from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/leaderboard', getLeaderboard);
router.post('/leaderboard/reset', resetAllLeaderboards);
router.put('/score', updateScore);
router.put('/:id/gameStats', overrideGameStats);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;
