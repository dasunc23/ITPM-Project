import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserGameAccess,
  recordGamePlay
} from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/:id/game-access', getUserGameAccess);
router.post('/:id/game-access/play', recordGamePlay);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

export default router;
