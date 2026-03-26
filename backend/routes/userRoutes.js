import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// CREATE user
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  const saved = await newUser.save();
  res.json(saved);
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;