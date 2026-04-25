import User from '../models/User.js';

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
    const user = new User(req.body);
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    
    const leaderboard = [];
    const games = ["Quiz Battle", "Typing Speed", "Coding Arena", "Memory Match"];
    
    games.forEach(game => {
      let gamePlayers = [];
      users.forEach(u => {
        if (u.gameStats && u.gameStats[game] && u.gameStats[game].points > 0) {
          gamePlayers.push({
            id: u._id + "_" + game,
            userId: u._id,
            game: game,
            username: u.name,
            wins: u.gameStats[game].wins,
            points: u.gameStats[game].points
          });
        }
      });
      // Sort by points desc
      gamePlayers.sort((a, b) => b.points - a.points);
      // Assign rank
      gamePlayers.forEach((p, index) => p.rank = index + 1);
      
      leaderboard.push(...gamePlayers);
    });
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user score
export const updateScore = async (req, res) => {
  try {
    const { userId, game, points, isWin } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (!user.gameStats) {
      user.gameStats = {
        "Quiz Battle": { wins: 0, points: 0 },
        "Typing Speed": { wins: 0, points: 0 },
        "Coding Arena": { wins: 0, points: 0 },
        "Memory Match": { wins: 0, points: 0 }
      };
    }
    
    if (user.gameStats[game]) {
      user.gameStats[game].points += points;
      if (isWin) {
        user.gameStats[game].wins += 1;
      }
    }
    
    // Explicitly mark modified for nested mixed objects
    user.markModified('gameStats');
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Override a specific user's game stats (Admin)
export const overrideGameStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { game, points, wins } = req.body;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (!user.gameStats) {
      user.gameStats = {
        "Quiz Battle": { wins: 0, points: 0 },
        "Typing Speed": { wins: 0, points: 0 },
        "Coding Arena": { wins: 0, points: 0 },
        "Memory Match": { wins: 0, points: 0 }
      };
    }
    
    if (user.gameStats[game]) {
      user.gameStats[game].points = Number(points);
      user.gameStats[game].wins = Number(wins);
    }
    
    user.markModified('gameStats');
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reset all users' leaderboards (Admin)
export const resetAllLeaderboards = async (req, res) => {
  try {
    // Reset all users' gameStats to 0
    const emptyStats = {
      "Quiz Battle": { wins: 0, points: 0 },
      "Typing Speed": { wins: 0, points: 0 },
      "Coding Arena": { wins: 0, points: 0 },
      "Memory Match": { wins: 0, points: 0 }
    };
    
    await User.updateMany({}, { $set: { gameStats: emptyStats } });
    
    res.json({ message: "All leaderboards have been reset." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
