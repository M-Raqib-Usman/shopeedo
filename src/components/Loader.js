import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullPage = false, message = 'Loading...' }) => {
  const containerClasses = fullPage 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
    : "flex flex-col items-center justify-center py-12 w-full";

  return (
    <div className={containerClasses}>
      <div className="relative w-20 h-20">
        {/* Pulsing Outer Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-orange-200"
        />
        
        {/* Spinning Inner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-2 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent shadow-lg"
        />

        {/* Center Logo/Icon Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-2xl font-black text-orange-600 italic"
          >
            S
          </motion.div>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-gray-600 font-medium tracking-wide animate-pulse"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default Loader;
