const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true 
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  stats: {
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
    totalGames: { 
      type: Number, 
      default: 0,
      min: [0, "Total games cannot be negative"]
    }
  },
  gameHistory: [{
    destinationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Destination', 
      required: true 
    },
    isCorrect: { 
      type: Boolean, 
      required: true 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
