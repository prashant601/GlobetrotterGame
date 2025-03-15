// controllers/userController.js

const User = require('../models/User');

// Helper to normalize and validate username
const normalizeUsername = (username) => {
  if (!username || username.trim() === '') {
    throw new Error('Username is required');
  }
  return username.trim().toLowerCase();
};

/**
 * Register a new user.
 * POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    let { username } = req.body;
    username = normalizeUsername(username);

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Create and save new user
    const newUser = new User({ username });
    await newUser.save();

    return res.json({
      success: true,
      user: {
        username: newUser.username,
        stats: newUser.stats
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get a user's profile.
 * GET /api/users/:username
 */
exports.getUserProfile = async (req, res) => {
  try {
    let { username } = req.params;
    username = normalizeUsername(username);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        username: user.username,
        stats: user.stats,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
