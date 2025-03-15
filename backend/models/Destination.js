const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Destination name is required"],
    trim: true 
  },
  city: { 
    type: String, 
    trim: true 
  },
  country: { 
    type: String, 
    trim: true 
  },
  continent: { 
    type: String, 
    trim: true 
  },
  coordinates: {
    latitude: { 
      type: Number, 
      min: [-90, "Latitude must be between -90 and 90"], 
      max: [90, "Latitude must be between -90 and 90"]
    },
    longitude: { 
      type: Number, 
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"]
    }
  },
  clues: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(arr) { return arr.length > 0; },
      message: "At least one clue is required"
    }
  },
  funFacts: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(arr) { return arr.length > 0; },
      message: "At least one fun fact is required"
    }
  },
  trivia: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(arr) { return arr.length > 0; },
      message: "At least one trivia fact is required"
    }
  },
  difficulty: { 
    type: String, 
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: "Difficulty must be Easy, Medium, or Hard"
    },
    default: 'Medium'
  },
  category: { 
    type: String, 
    required: [true, "Category is required"],
    trim: true 
  },
  options: { // TODO: Remove: not needed
    type: [String], 
    default: [],
    validate: {
      validator: function(arr) { return arr.length >= 2; },
      message: "At least 2 options are required"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
