import React, { useEffect, useState } from "react";
import { UserIcon, CheckCircle, XCircle, Gamepad2 } from "lucide-react";

export default function ProfilePage() {

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      setError("No username found. Please enter your name on the home page.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${username}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        setError("An error occurred while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return <div className="text-white text-xl mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-xl mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4">
      <div className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-blur-md w-full max-w-lg flex flex-col items-center mt-10">
        <div className="flex items-center space-x-4 mb-6">
          <UserIcon className="w-16 h-16 text-green-400" />
          <div>
            <h2 className="text-3xl font-bold text-green-300">{user.username}</h2>
            <p className="text-gray-300">Joined: {user.createdAt}</p>
          </div>
        </div>
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-lg font-semibold">Correct Answers</span>
            </div>
            <span className="text-xl font-bold">{user.stats.correctAnswers}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <XCircle className="w-6 h-6 text-red-400" />
              <span className="text-lg font-semibold">Incorrect Answers</span>
            </div>
            <span className="text-xl font-bold">{user.stats.incorrectAnswers}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Total Games Played</span>
            </div>
            <span className="text-xl font-bold">{user.stats.totalGames}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
