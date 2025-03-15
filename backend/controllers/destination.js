// controllers/destinationController.js
const Destination = require('../models/Destination');

exports.getRandomDestinationWithOptions = async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      return res.status(404).json({ success: false, message: 'No destinations found' });
    }

    // Get a random destination
    const randomIndex = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(randomIndex);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Get 3 other random destinations for options, excluding the chosen one
    const otherOptions = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } }
    ]);

    // Combine and shuffle options using a simple sort with Math.random()
    const options = [destination, ...otherOptions].sort(() => Math.random() - 0.5);

    res.json({
      success: true,
      destination,
      options
    });
  } catch (error) {
    console.error('Error fetching random destination:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }
    return res.json({
      success: true,
      destination
    });
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

