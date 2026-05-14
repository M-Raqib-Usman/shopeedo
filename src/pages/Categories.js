import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { getCategories } from '../services/api';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import SmartImage from '../components/SmartImage';

export default function Categories() {
  const navigate = useNavigate();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Image mapping for known category names
  const imageMap = {
    'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    'biryani': 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80',
    'burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    'desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
    'dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
    'chinese': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
    'fast food': 'https://images.unsplash.com/photo-1626229652216-e5bb7f511917?w=400&q=80',
    'drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
    'beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
    'bbq': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    'karahi': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80',
    'shawarma': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
    'default': 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80'
  };

  // Static fallback categories
  const staticCategories = [
    { name: 'Pizza', image: imageMap.pizza },
    { name: 'Biryani', image: imageMap.biryani },
    { name: 'Burgers', image: imageMap.burgers },
    { name: 'Desserts', image: imageMap.desserts },
    { name: 'Drinks', image: imageMap.drinks },
    { name: 'Chinese', image: imageMap.chinese },
    { name: 'BBQ', image: imageMap.bbq },
    { name: 'Groceries', image: imageMap.groceries }
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const categoryData = await getCategories();
        if (categoryData && categoryData.length > 0) {
          const mapped = categoryData.map(cat => ({
            name: cat,
            image: imageMap[cat.toLowerCase()] || imageMap.default
          }));
          setDynamicCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const categoriesToShow = dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

  if (loading) {
    return <Loader fullPage message="Loading fresh categories..." />;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-8 text-gray-900 border-b-4 border-orange-500 w-fit pb-2">All Categories</h2>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5"
        >
          {categoriesToShow.map((item) => {
            const name = typeof item === 'string' ? item : item.name;
            const image = typeof item === 'string' ? (imageMap[item.toLowerCase()] || imageMap.default) : item.image;
            return (
              <motion.button
                key={name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/category/${name.toLowerCase()}`)}
                className="flex flex-col items-center justify-end h-40 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group overflow-hidden relative w-full"
              >
                <div className="absolute inset-0 z-0">
                  <SmartImage src={image} fallbackText={name} className="w-full h-full group-hover:scale-110 transition-transform duration-700 object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                <span className="relative z-20 text-[15px] font-black capitalize text-white text-center pb-4 tracking-wide group-hover:text-orange-400 transition-colors drop-shadow-md w-full">{name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
