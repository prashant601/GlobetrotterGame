// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Register a new user
router.post('/register', userController.registerUser);

// Get user profile by username
router.get('/:username', userController.getUserProfile);

module.exports = router;