const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

/**
 * Create a new challenge
 * POST /api/challenges/create
 */
exports.createChallenge = async (req, res) => {
  try {
    let { username, score } = req.body;

    // Validate username
    if (!username || username.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Normalize username
    username = username.trim().toLowerCase();

    // Find user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine score data: use passed score if available; otherwise, calculate from user stats
    let scoreData = {};
    if (score) {
      scoreData = {
        correctAnswers: score.correct,
        incorrectAnswers: score.incorrect,
        totalAnswers: score.total,
        successRate: score.successRate
      };
    } else {
      const totalAnswers = user.stats.correctAnswers + user.stats.incorrectAnswers;
      const successRate = totalAnswers > 0 
        ? Math.round((user.stats.correctAnswers / totalAnswers) * 100)
        : 0;
      scoreData = {
        correctAnswers: user.stats.correctAnswers,
        incorrectAnswers: user.stats.incorrectAnswers,
        totalAnswers,
        successRate
      };
    }

    // Create a new challenge using a short invite code (first 8 chars of a UUID)
    const newChallenge = new Challenge({
      creatorId: user._id,
      creatorName: user.username,
      inviteCode: uuidv4().substring(0, 8),
      creatorScore: scoreData.successRate,
      correctAnswers: scoreData.correctAnswers,
      incorrectAnswers: scoreData.incorrectAnswers,
      destinationsGuessed: scoreData.totalAnswers
    });

    await newChallenge.save();

    return res.json({
      success: true,
      inviteCode: newChallenge.inviteCode
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get challenge details by invite code
 * GET /api/challenges/:inviteCode
 */
exports.getChallengeDetails = async (req, res) => {
  try {
    const { inviteCode } = req.params;

    const challenge = await Challenge.findOne({ inviteCode });
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    return res.json({
      success: true,
      challenge: {
        creatorName: challenge.creatorName,
        creatorScore: challenge.creatorScore,
        correctAnswers: challenge.correctAnswers,
        incorrectAnswers: challenge.incorrectAnswers,
        destinationsGuessed: challenge.destinationsGuessed,
        createdAt: challenge.createdAt,
        acceptedBy: challenge.acceptedBy
      }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Accept a challenge
 * POST /api/challenges/:inviteCode/accept
 */
exports.acceptChallenge = async (req, res) => {
  try {
    const { inviteCode } = req.params;
    let { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Normalize username
    username = username.trim().toLowerCase();

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate user score percentage
    const totalAnswers = user.stats.correctAnswers + user.stats.incorrectAnswers;
    const scorePercentage = totalAnswers > 0 
      ? Math.round((user.stats.correctAnswers / totalAnswers) * 100)
      : 0;

    // Update the challenge by adding the user to the acceptedBy list
    const challenge = await Challenge.findOneAndUpdate(
      { inviteCode },
      {
        $push: {
          acceptedBy: {
            userId: user._id,
            username: user.username,
            score: scorePercentage,
            correctAnswers: user.stats.correctAnswers,
            incorrectAnswers: user.stats.incorrectAnswers,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    return res.json({
      success: true,
      challenge: {
        creatorName: challenge.creatorName,
        creatorScore: challenge.creatorScore,
        acceptedBy: challenge.acceptedBy
      }
    });
  } catch (error) {
    console.error('Error accepting challenge:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
