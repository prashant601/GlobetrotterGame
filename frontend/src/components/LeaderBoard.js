import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data from the API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/game/leaderboard`);
        if (response.data.success) {
          setLeaderboard(response.data.leaderboard);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Render a loading spinner while fetching data
  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4 relative">
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-r from-gray-400 to-blue-600 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-white text-center mb-8"> Leaderboard </h2>
      
      {/* Scrollable Leaderboard Content */}
      <div className="max-h-96 overflow-y-auto">
        {leaderboard.map((user) => (
          <div
            key={user._id}
            className="flex justify-between bg-white p-6 rounded-lg mb-6 shadow-md"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-semibold mr-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                <p className="text-sm text-gray-500">Joined: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-xl font-semibold text-gray-800">{user.stats.correctAnswers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Incorrect Answers</p>
                <p className="text-xl font-semibold text-gray-800">{user.stats.incorrectAnswers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Games Played</p>
                <p className="text-xl font-semibold text-gray-800">
                  {user.stats.correctAnswers + user.stats.incorrectAnswers}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Leaderboard;
