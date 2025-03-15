// routes/challengeRoutes.js

const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge');

// Route to create a new challenge
router.post('/create', challengeController.createChallenge);

// Route to get challenge details by invite code
router.get('/:inviteCode', challengeController.getChallengeDetails);

// Route to accept a challenge
router.post('/:inviteCode/accept', challengeController.acceptChallenge);

module.exports = router;