import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { X, Copy } from "lucide-react";
import html2canvas from 'html2canvas';
import { FaWhatsapp } from "react-icons/fa";


const ShareChallengePopup = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

fetch(`${API_URL}/destinations/random`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching data:", error));

    const { inviteCode } = useParams();
    const navigate = useNavigate();
    const [inviteesDetails, setInviteesDetails] = useState({ correctAnswers: 0, incorrectAnswers: 0, destinationsGuessed: 0, creatorName: "", creatorScore: 0, createdAt:"", acceptedBy: "" });
    const [imageUrl, setImageUrl] = useState("");
    useEffect(() => {
        fetchChallengeDetails();
        generateInviteImage();
    },[inviteCode])
    
    const fetchChallengeDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/challenge/${inviteCode}`);
            setInviteesDetails(response.data.challenge);
        } catch (error) {
            console.error("Error fetching challenge details:", error);
        }
    }

    const onClose = () => {
        navigate('/');//redirect to home page
    }
    const handleCopyLink = () => {
        navigator.clipboard.writeText(imageUrl);
        alert("Link copied to clipboard!");
    };

    const generateInviteImage = () => {
        setTimeout(() => {
          const element = document.getElementById('invite-image');
          if (element) {
            html2canvas(element).then(canvas => {
                setImageUrl(canvas.toDataURL('image/png'));
            });
          }
          else{
            console.log("Error generating image");
          }
        }, 500);
      };

    const challengeLink = `https://globetrottergame.onrender.com//challenge/${inviteCode}`;
    const whatsappShareMessage = `🔥 Challenge Accepted? 🌎✈️\nHey! I just played *Globetrotter Quiz* and put my travel knowledge to the test! 🗺️ \n🏆 *Explorer:* ${inviteesDetails.creatorName}\n🎯 *Score:* ✅ ${inviteesDetails.correctAnswers} | ❌ ${inviteesDetails.incorrectAnswers}\n📊 *Success Rate:* ${inviteesDetails.creatorScore}% \n🌍 *Can you beat my score?*  \n🚀 Take the challenge here: ${challengeLink} \nTest your travel IQ and let's see who’s the real globetrotter! 🌟`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareMessage)}`;

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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compete With Your Friends 🤩!</h2>
        
        <div id = "invite-image" className="bg-gradient-to-r from-blue-500 to-gray-500 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2">
            Globetrotter Challenge
          </h3>
          <p className="text-sm mt-2">Can you beat {inviteesDetails.creatorName}'s score in this game? Try it😎 !</p>

          <div className="bg-white bg-opacity-20 p-4 rounded-lg mt-4 text-left">
            <p className="font-bold">UserName: <span className="text-yellow-300">{inviteesDetails.creatorName}</span></p>
            <p>✅ Correct Guesses: <span className="font-bold text-green-400">{inviteesDetails.correctAnswers}</span></p>
            <p>🌍 Total Destination Guessed: <span className="font-bold">{inviteesDetails.destinationsGuessed}</span></p>
          </div>
          
          <p className="text-sm mt-2">Play and Have Fun!</p>
        </div>

        <div className="flex justify-center gap-4 mt-4 my-4">
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Copy size={18} /> Copy ScoreCard
          </button>
          <button onClick={() => window.open(whatsappUrl, "_blank")} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaWhatsapp size={18} /> Share Challenge
          </button>
        </div>
        <h4 className="text-black"> ScoreCard Preview</h4>
        <img src={imageUrl} alt="Challenge Preview" className="mt-4 rounded-lg shadow-md w-full" />
      </motion.div>
    </div>
    </div>
  );
};

export default ShareChallengePopup;
