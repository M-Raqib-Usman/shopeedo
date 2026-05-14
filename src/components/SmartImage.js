import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartImage = ({ src, alt, className, fallbackText = 'Image' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Placeholder images for different types if needed
  const placeholder = `https://via.placeholder.com/400x300?text=${encodeURIComponent(fallbackText)}`;

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Shimmer Loading Effect */}
      <AnimatePresence>
        {loading && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error ? (
        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
          <ImageOff size={32} strokeWidth={1.5} />
          <span className="text-xs mt-2 font-medium">Image not available</span>
        </div>
      ) : (
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: loading ? 0 : 1, 
            scale: loading ? 1.05 : 1 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src={src || placeholder}
          alt={alt}
          className={`w-full h-full object-cover ${loading ? 'invisible' : 'visible'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      )}
    </div>
  );
};

export default SmartImage;
