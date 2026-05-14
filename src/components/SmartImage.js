import { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartImage = ({ src, alt, className, fallbackText = 'Image' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Safety timeout: If image hasn't loaded in 5s, try to show it anyway
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  // Check if image is already in cache
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoading(false);
    }
  }, [src]);

  const FallbackPattern = () => (
    <div className="w-full h-full bg-orange-50 flex flex-col items-center justify-center p-4 text-center border border-orange-100">
      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2 text-orange-500">
        <ImageOff size={24} />
      </div>
      <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest leading-tight px-2">{fallbackText}</p>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
    </div>
  );

  return (
    <div className={`relative overflow-hidden bg-gray-50 group ${className}`}>
      {/* Loading Overlay (Shimmer) */}
      <AnimatePresence>
        {loading && !error && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100"
          >
            <div className="w-full h-full animate-shimmer" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error || !src ? (
        <FallbackPattern />
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default SmartImage;
