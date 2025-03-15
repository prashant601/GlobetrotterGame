// routes/destinationRoutes.js

const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destination');

// Route to get a random destination along with multiple-choice options
router.get('/random', destinationController.getRandomDestinationWithOptions);

router.get('/:id', destinationController.getDestinationById);

module.exports = router;
