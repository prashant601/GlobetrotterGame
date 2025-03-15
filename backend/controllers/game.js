// controllers/gameController.js
const User = require('../models/User');
const rateLimit = require('express-rate-limit'); // Import rate limiter

/**
 * Check if the answer is correct and update the user's stats.
 * Expects:
 * - destinationId: the ID of the destination.
 * - answer: an object with an "id" property (the correct answer's ID).
 * - username: the user's username.
 */
exports.checkAnswer = async (req, res) => {
  try {
    const { destinationId, answer, username } = req.body;
    
    // Validate that username is provided
    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
    
    // Normalize username
    const normalizedUsername = username.trim().toLowerCase();
    
    // Check if the answer is correct
    // (Assumes answer is an object with an "id" property)
    const isCorrect = destinationId === answer._id;
    
    // Update user stats: increment correct/incorrect counters and record the game history
    await User.findOneAndUpdate(
      { username: normalizedUsername },
      {
        $inc: {
          'stats.correctAnswers': isCorrect ? 1 : 0,
          'stats.incorrectAnswers': isCorrect ? 0 : 1,
          'stats.totalGames': 1
        },
        $push: {
          gameHistory: {
            destinationId,
            isCorrect
          }
        }
      },
      { new: true }
    );
    
    return res.json({
      success: true,
      isCorrect
    });
  } catch (error) {
    console.error('Error checking answer:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message: "Too many requests, please try again later."
});


// Get the top 10 users based on correct answers
exports.getLeaderboard = [limiter, async (req, res) => {
  try {
    // Fetch the top 10 users sorted by correct answers
    const leaderboard = await User.find()
      .sort({ 'stats.correctAnswers': -1 }) // Sort by correctAnswers in descending order
      .limit(10)
      .select('username stats.correctAnswers stats.incorrectAnswers') // Only select needed fields

    if (!leaderboard || leaderboard.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No leaderboard data found.'
      });
    }

    return res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}];