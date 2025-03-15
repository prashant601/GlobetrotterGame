const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  creatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "Creator ID is required"]
  },
  creatorName: { 
    type: String, 
    required: [true, "Creator name is required"],
    trim: true 
  },
  inviteCode: {
    type: String,
    required: [true, "Invite code is required"],
    unique: true,
    trim: true,
    minlength: [3, "Invite code should be at least 3 characters long"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    default: function() {
      // Challenges expire after 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  },
  creatorScore: { 
    type: Number, 
    default: 0,
    min: [0, "Score cannot be negative"]
  },
  correctAnswers: { 
    type: Number, 
    default: 0,
    min: [0, "Correct answers cannot be negative"]
  },
  incorrectAnswers: { 
    type: Number, 
    default: 0,
    min: [0, "Incorrect answers cannot be negative"]
  },
  destinationsGuessed: { 
    type: Number, 
    default: 0,
    min: [0, "Destinations guessed cannot be negative"]
  },
  acceptedBy: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    username: { 
      type: String, 
      required: true,
      trim: true 
    },
    score: { 
      type: Number, 
      default: 0,
      min: [0, "Score cannot be negative"]
    },
    correctAnswers: { 
      type: Number, 
      default: 0,
      min: [0, "Correct answers cannot be negative"]
    },
    incorrectAnswers: { 
      type: Number, 
      default: 0,
      min: [0, "Incorrect answers cannot be negative"]
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
