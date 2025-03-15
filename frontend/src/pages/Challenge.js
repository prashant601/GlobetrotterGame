import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Target } from "lucide-react";

const AcceptChallenge = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [inviteesDetails, setInviteesDetails] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    destinationsGuessed: 0,
    creatorName: "",
    creatorScore: 0,
    createdAt: "",
    acceptedBy: "",
  });

  useEffect(() => {
    fetchChallengeDetails();
  }, [inviteCode]);

  const fetchChallengeDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/challenge/${inviteCode}`);
      setInviteesDetails(response.data.challenge);
    } catch (error) {
      console.error("Error fetching challenge details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4 relative">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-xl max-w-lg w-full text-center relative"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You have been Challenged 🤓!</h2>

          <div className="bg-gradient-to-r from-blue-500 to-gray-500 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
              Globetrotter Challenge
            </h3>
            <p className="text-sm mt-2">
              Can you beat {inviteesDetails.creatorName}'s score in this game? <br/>Time to Show Your Skills 😎!
            </p>

            <div className="bg-white bg-opacity-20 p-4 rounded-lg mt-4 text-left">
              <p className="font-bold">
                Invitee's Name: <span className="text-yellow-300">{inviteesDetails.creatorName}</span>
              </p>
              <p>
                ✅ Invitee's Correct Guesses:{" "}
                <span className="font-bold text-green-400">{inviteesDetails.correctAnswers}</span>
              </p>
              <p>
                🌍 Invitee's Total Guesses:{" "}
                <span className="font-bold text-gray">{inviteesDetails.destinationsGuessed}</span>
              </p>
              <p>
                🧿 Your Invitee's Score: {" "}
                <span className="font-bold">{inviteesDetails.creatorScore} %</span>
              </p>
            </div>

            <p className="text-sm mt-2">Play and Have Fun!</p>
          </div>

          <div className="flex justify-center gap-4 mt-4 my-4">
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Target size={18} /> Accept Challenge
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AcceptChallenge;
