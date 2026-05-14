import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      className={`bg-gray-200 rounded-2xl ${className}`}
    />
  );
};

export const RestaurantSkeleton = () => (
  <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm p-0">
    <Skeleton className="w-full h-44 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-4 pt-2">
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex-shrink-0 w-28 h-36 rounded-3xl bg-gray-100 flex flex-col items-center justify-end pb-4 space-y-3">
    <Skeleton className="w-16 h-4 rounded-full" />
  </div>
);

export default Skeleton;
