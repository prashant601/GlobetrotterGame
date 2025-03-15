import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, UserIcon, Play } from "lucide-react";


export default function NavBar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const updateUsername = () => {
      setUsername(localStorage.getItem("username") || "");
    };
    updateUsername(); // Initial fetch
    window.addEventListener("usernameUpdated", updateUsername);
    return () => {
      window.removeEventListener("usernameUpdated", updateUsername);
    };
  }, []);

  //   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

  return (
    <nav className="w-full flex justify-between items-center p-6 bg-gray-900 bg-opacity-40 shadow-md text-white fixed top-0 backdrop-blur-lg z-10">
      <Link to="/"  ><h1 className="text-4xl font-extrabold tracking-wide text-green-300">Globetrotter</h1></Link>
      <div className="flex items-center space-x-8">
        <Link to="/play" className="flex items-center space-x-2 hover:text-green-300 transition duration-300">
          <Play className="w-6 h-6" />
          <span className="text-lg font-medium">Play</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-2 hover:text-green-300 transition duration-300">
          <UserIcon className="w-6 h-6" />
          <span className="text-lg font-medium">Profile</span>
        </Link>
        <Link to="/leaderboard" className="flex items-center space-x-2 hover:text-green-300 transition duration-300">
          <Trophy className="w-6 h-6" />
          <span className="text-lg font-medium">Leaderboard</span>
        </Link>
        {username && (
          <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <UserIcon className="w-5 h-5 text-green-400" />
            <span className="text-lg font-semibold text-white">{username}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
