import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import HomePage from './pages/Home';
import GamePage from './pages/Game';
import ProfilePage from './pages/Profile';
import NavBar from './components/NavBar';
import ShareChallengePage from './pages/ShareChallenge.js';
import LeaderBoard from './components/LeaderBoard.js';
import AcceptChallenge from './pages/Challenge';
import NotFoundPage from './pages/NotFound';

import './index.css';

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path= "/profile" element = {<ProfilePage/>}/>
          <Route path = "/leaderboard" element = {<LeaderBoard/>}/>
          <Route path="/shareChallenge/:inviteCode" element={<ShareChallengePage />} />
          <Route path="/challenge/:inviteCode" element={<AcceptChallenge/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
