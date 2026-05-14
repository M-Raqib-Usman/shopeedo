import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartImage = ({ src, alt, className, fallbackText = 'Image' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Premium pattern-based fallback
  const FallbackPattern = () => (
    <div className="w-full h-full bg-orange-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mb-3 text-orange-500">
        <ImageOff size={32} />
      </div>
      <p className="text-sm font-black text-orange-900 uppercase tracking-tighter leading-none">{fallbackText}</p>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f97316 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
    </div>
  );

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
      {error || !src ? (
        <FallbackPattern />
      ) : (
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: loading ? 0 : 1, 
            scale: loading ? 1.05 : 1 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          src={src}
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
