import User from '../models/User.js';

const FREE_GAME_PLAY_LIMIT = 5;

const formatGameAccess = (user) => {
  const freePlaysUsed = user.freeGamePlays || 0;
  const freePlaysRemaining = Math.max(FREE_GAME_PLAY_LIMIT - freePlaysUsed, 0);

  return {
    freePlayLimit: FREE_GAME_PLAY_LIMIT,
    freePlaysUsed,
    freePlaysRemaining,
    hasPaidGameAccess: Boolean(user.hasPaidGameAccess),
    requiresPayment: !user.hasPaidGameAccess && freePlaysUsed >= FREE_GAME_PLAY_LIMIT,
  };
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a user
export const createUser = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      campus: req.body.campus?.trim(),
      year: req.body.year?.toString().trim(),
      role: req.body.role || "user",
    };

    const requiredFields = ["name", "email", "password", "campus", "year"];
    const missingField = requiredFields.find((field) => !payload[field]);

    if (missingField) {
      return res.status(400).json({ message: `${missingField} is required` });
    }

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = new User(payload);
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    res.status(400).json({ message: error.message || "Unable to create user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGameAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      access: formatGameAccess(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const recordGamePlay = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.hasPaidGameAccess && (user.freeGamePlays || 0) >= FREE_GAME_PLAY_LIMIT) {
      return res.status(403).json({
        success: false,
        message: "Free play limit reached. Payment required to continue.",
        access: formatGameAccess(user),
      });
    }

    if (!user.hasPaidGameAccess) {
      user.freeGamePlays = (user.freeGamePlays || 0) + 1;
      await user.save();
    }

    return res.json({
      success: true,
      access: formatGameAccess(user),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
