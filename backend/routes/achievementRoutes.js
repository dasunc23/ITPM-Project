import express from 'express';
import Achievement from '../models/Achievement.js';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Award a new achievement
router.post('/', async (req, res) => {
  const { title, game, badge, earnedBy } = req.body;
  try {
    const newAchievement = new Achievement({ title, game, badge, earnedBy });
    await newAchievement.save();
    res.status(201).json(newAchievement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete/Revoke an achievement
router.delete('/:id', async (req, res) => {
  try {
    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
