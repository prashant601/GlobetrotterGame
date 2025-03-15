import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ArrowRightCircle, Share2 } from "lucide-react";

export default function GamePage() {
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupColor, setPopupColor] = useState("green");
  const [fact, setFact] = useState("");
  const [score, setScore] = useState({ correctAnswers: 0, incorrectAnswers: 0, totalGames: 0 });
  const username = localStorage.getItem("username"); // Fetch username from local storage

  useEffect(() => {
    fetchQuestion();
    fetchUserScore();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${API_URL}/destinations/random`);
      const destination = response.data.destination;
      setQuestionData(destination);
      setOptionsData(response.data.options);
      setFact(destination.trivia?.[0] || "No trivia available for this destination.");
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const fetchUserScore = async () => {
    if (username) {
      try {
        const response = await axios.get(`${API_URL}/users/${username}`);
        setScore(response.data.user.stats);
      } catch (error) {
        console.error("Error fetching user score:", error);
      }
    }
  };

  const handleAnswer = async (option) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);

    const isCorrect = option._id === questionData._id;
    setPopupMessage(isCorrect ? "🎉 Correct! Well done!" : "❌ Aww... Try Again!");
    setPopupColor(isCorrect ? "green" : "red");
    setShowPopup(true);

    setScore((prev) => ({
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        totalGames: prev.totalGames + 1,
      }));
    // Call API to update user score
    if (username) {
      try {
        await axios.post(`${API_URL}/game/check-answer`, {
          answer: option, // // Send the selected option
          username ,
          destinationId: questionData._id,
        });
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }
    else{
        alert('Please register with a username first to update your score!');
        return;
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    setShowPopup(false);
    fetchQuestion();
  };

  const shareChallenge = async () =>{
    if(username){
        try {
            const response = await axios.post(`${API_URL}/challenge/create`, {
              username,
              score: {
                correct: score.correctAnswers,
                incorrect: score.incorrectAnswers,
                total: score.totalGames,
                successRate: score.totalGames > 0 ? Math.round((score.correctAnswers / score.totalGames) * 100) : 0,
              },
            });
            if (response.data.success && response.data.inviteCode) {
                navigate(`/shareChallenge/${response.data.inviteCode}`);
            } else {
              alert('Challenge Creation Failed.. Please try again.');
            }
          } catch (error) {
            console.error("Error creating challenge:", error);
            alert('Error creating challenge. Please try again.');
          }
    }
    else{
        alert('Please register with a username first to create a challenge!');
    }

  }

  if (!questionData) {
    return <p className="text-center text-white text-xl">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4 relative">

        {/* Score Summary */}

        <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-r from-gray-400 to-blue-600 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                {/* Score Section */}
                <div className="flex items-center space-x-2">
                    <span className="text-green-500 text-xl">✅</span>
                    <p className="font-bold text-white text-lg">Correct Answers:  {score.correctAnswers}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-xl">❌</span>
                    <p className="font-bold text-white text-lg">Wrong Answers: {score.incorrectAnswers}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-blue-500 text-xl">🌍</span>
                    <p className="font-bold text-white text-lg">Total Guesses: {score.totalGames}</p>
                </div>
            </div>
        </div>

      <div className="grid grid-cols-10 w-full max-w-7xl mt-16">
        <div className="col-span-1"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 bg-gray-900 bg-opacity-70 p-10 shadow-xl rounded-2xl text-center backdrop-blur-md"
        >
          <h1 className="text-4xl font-extrabold text-green-300 mb-6">Guess the Destination!</h1>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-800 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-blue-300">Clue 1</h2>
              <p className="text-gray-300">{questionData.clues[0]}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-blue-300">Clue 2</h2>
              <p className="text-gray-300">{questionData.clues[1]}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {optionsData.map((option, index) => (
              <button
                key={option._id} // Use ID as key
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-lg text-lg font-bold transition-all flex items-start gap-2
                  bg-gray-700 hover:bg-gray-800 
                  ${answered && option._id === questionData._id ? "bg-green-500" : ""} 
                  ${selectedOption && selectedOption._id === option._id && option._id !== questionData._id ? "bg-red-500" : ""}
                `}
              >
                <span className="text-green-400 font-extrabold">{String.fromCharCode(65 + index)}.</span> {option.name}
              </button>
            ))}
          </div>
          <div className="mt-12 flex justify-between space-x-4">
                <button
                    onClick={nextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg font-bold rounded-lg flex items-center gap-2 transition duration-300"
                >
                    <ArrowRightCircle size = {20}/>Next Challenge
                </button>
                <button
                    onClick={shareChallenge}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-bold rounded-lg flex items-center gap-2 transition duration-300"
                >
                    <Share2 size={20} /> Share Challenge
                </button>
            </div>
        </motion.div>
        <div className="col-span-1"></div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center"
          >
            <div className={`w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-${popupColor}-500 text-5xl text-black mb-4`}> 
              {popupColor === "green" ? "🎉" : "☹️"}
            </div>
            <h2 className="text-3xl font-bold text-black">{popupMessage}</h2>
            {popupColor === "red" && (
              <div className="mt-6 p-4 bg-gray-200 rounded-xl">
                <p className="text-xl font-semibold text-red-700">Wrong Answer</p>
                <p className="text-xl font-semibold text-green-700">
                  Correct Answer: <span className="font-bold bg-green-400 text-white px-3 py-1 rounded-lg">{questionData.name}</span>
                </p>
              </div>
            )}
            <div className="bg-gray-200 p-4 rounded-xl mt-6">
              <h3 className="text-xl font-semibold text-blue-700">Did you know?</h3>
              <p className="text-gray-800 mt-2 text-lg">{fact}</p>
            </div>
            <div className="mt-12 flex justify-center space-x-4">
                <button
                    onClick={nextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg font-bold rounded-lg flex items-center gap-2 transition duration-300"
                >
                    <ArrowRightCircle size = {20}/> Next Challenge
                </button>
                <button
                    onClick={shareChallenge}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg font-bold rounded-lg flex items-center gap-2 transition duration-300"
                >
                    <Share2 size={20} /> Share Challenge
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
