// routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

// POST /api/game/check-answer
router.post('/check-answer', gameController.checkAnswer);

// GET /api/game/leaderboard
router.get('/leaderboard', gameController.getLeaderboard); // New route for leaderboard

module.exports = router;
