import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { getCategories } from '../services/api';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import SmartImage from '../components/SmartImage';
import { getCategoryImage, imageMap } from '../utils/imageUtils';

export default function Categories() {
  const navigate = useNavigate();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
            image: getCategoryImage(cat)
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
            const image = typeof item === 'string' ? getCategoryImage(item) : (item.image || getCategoryImage(name));
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
