import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 to-green-600 flex flex-col items-center justify-center text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mt-20"
      >
        <h1 className="text-8xl font-bold text-green-300 mb-6">🧭</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Destination Not Found</h2>
        <p className="text-xl text-gray-200 opacity-90 mb-8 max-w-lg">
          Looks like you've wandered off the map! Let's get you back on track.
        </p>
        
        <Link 
          to="/"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;