# Globetrotter - Travel Guessing Game 🌍✈️

Welcome to **Globetrotter**, a fun and interactive travel guessing game! Test your knowledge of world destinations by solving cryptic clues and challenging your friends to beat your score. Whether you're a seasoned traveler or a geography enthusiast, this game will keep you entertained while exploring the world!

## 🕹️ **Game Features**

### 🎮 **Play the Game**
- **Guess the Destination**: Players are presented with cryptic clues and have to choose the correct destination from multiple options.
- **Immediate Feedback**: Correct answers trigger a fun animation with confetti, while incorrect answers show a sad face with a fact.
- **Score Tracking**: Each correct and incorrect answer affects your score, and your stats are updated in real-time.

### 👯 **Challenge a Friend**
- **Create Challenges**: After playing a game, you can create a unique challenge with your score and send an invite link to friends.
- **Accept Challenges**: Friends can accept your challenge and compete with your score. The game has all the same features for a fun, competitive experience.
- **Leaderboard**: The best players are ranked on the leaderboard, showcasing top scores and user stats.

### 🏆 **Leaderboard**
- View the list of top 10 players and their scores.

### 🏆 **Profile**
- Keep track of your scores and profile

---

## 📋 **How to Play**

1. **Create an Account**: Register with a unique username to track your scores.
2. **Play the Game**: Receive clues and select a destination. Get instant feedback based on your answer.
3. **Challenge a Friend**: Once you’ve played a round, create a challenge and invite friends to compete.
4. **Check the Leaderboard**: See where you stand in comparison to other players.

---

## 🔧 **Tech Stack**

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Animations**: React Confetti
- **API Requests**: Axios for HTTP requests

---

# Globetrotter API Routes Documentation

## API Routes Overview

### Base Routes
- **/api/destinations** 🌍: Routes related to destinations.
- **/api/game** 🎮: Routes related to game mechanics and leaderboard.
- **/api/users** 👤: Routes for user registration and profile.
- **/api/challenge** 🏆: Routes for creating and managing challenges.

---

## API Endpoints

### /api/destinations 🌍

- **GET /random** 
  - Fetches a random destination with multiple-choice options.

- **GET /:id**
  - Fetches destination details by ID.

---

### /api/game 🎮

- **POST /check-answer**
  - Checks the player's answer and updates their score.

- **GET /leaderboard**
  - Fetches the top scores from players around the world.

---

### /api/users 👤

- **POST /register**
  - Registers a new user with a unique username.

- **GET /:username**
  - Fetches a user’s profile (username, score, stats).

---

### /api/challenge 🏆

- **POST /create**
  - Creates a new challenge with the current score.

- **GET /:inviteCode**
  - Fetches challenge details using an invite code.

- **POST /:inviteCode/accept**
  - Accepts a challenge from another user.

---