import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setSubmitted(true);
    }
  }, []);

  const registerUser = async (username) => {
    try {
      await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      console.log("User registered successfully:", username);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      localStorage.setItem("username", username);
      window.dispatchEvent(new Event("usernameUpdated"));
      localStorage.setItem("usernameExpiry", expiryDate.getTime());
      await registerUser(username);
      setSubmitted(true);

      // if user got invited.. update in challenge accept api
      const inviteCode = localStorage.getItem("inviteCode");
      const inviteExpiry = localStorage.getItem("inviteExpiry");
      const x = new Date().getTime() < inviteExpiry;
      if(inviteExpiry && new Date().getTime() < inviteExpiry){
        const response = await axios.post(`${API_URL}/challenge/${inviteCode}/accept`, {username});
        if(response.data.success){
          localStorage.removeItem("inviteCode");
          localStorage.removeItem("inviteExpiry");
        }
      }
    }
  };
  useEffect(() => {
    const expiry = localStorage.getItem("usernameExpiry");
    if (expiry && new Date().getTime() > expiry) {
      localStorage.removeItem("username");
      localStorage.removeItem("usernameExpiry");
      setUsername("");
      setSubmitted(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4">
      {!submitted ? (
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md w-full max-w-md mt-28">
          <h2 className="text-2xl font-bold text-center text-green-300 mb-4">Enter Your Username</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mt-28 md:mt-36"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg text-green-200">Guess the Destination!</h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
            Challenge yourself with cryptic clues and test your travel knowledge.
            Compete with friends and climb the leaderboard!
          </p>
        </motion.div>
      )}
      {submitted && (
        <div className="mt-12 p-8 bg-gray-800 bg-opacity-50 shadow-lg rounded-2xl backdrop-blur-md">
          <div className="flex flex-col items-center">
            <Link to="/play" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 text-xl rounded-full shadow-md transition duration-300 transform hover:scale-105">
              Start Playing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}