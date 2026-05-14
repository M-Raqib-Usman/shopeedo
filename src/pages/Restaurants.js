import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getRestaurants } from '../services/api';
import { useCart } from '../context/CartContext';
import SmartImage from '../components/SmartImage';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

export default function Restaurants() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        setRestaurants([
          { id: 1, name: 'Pizza Point Sahiwal', cuisine: 'Pizza • Fast Food', rating: 4.6, deliveryTime: '20-35 min', deliveryFee: 'Rs. 99', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop' },
          { id: 2, name: 'Biryani House', cuisine: 'Biryani • Pakistani', rating: 4.8, deliveryTime: '25-40 min', deliveryFee: 'Free', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1974&auto=format&fit=crop' },
          { id: 3, name: 'Burger Lab', cuisine: 'Burgers • American', rating: 4.4, deliveryTime: '15-30 min', deliveryFee: 'Rs. 149', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRestaurantItemCount = (restaurantId) => {
    return cartItems.filter(item => item.restaurantId === restaurantId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return <Loader fullPage message="Loading best restaurants..." />;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black mb-8 text-gray-900 border-b-4 border-orange-500 w-fit pb-2">All Restaurants</h2>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {restaurants.map((restaurant) => {
            const itemCount = getRestaurantItemCount(restaurant.id);
            return (
              <motion.div
                key={restaurant.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-gray-100 group"
              >
                <div className="relative overflow-hidden h-48">
                  <SmartImage
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    fallbackText={restaurant.name}
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-2xl text-xs font-bold shadow flex items-center gap-1">
                    ⭐ {restaurant.rating}
                  </div>
                  {itemCount > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-2xl flex items-center gap-1 shadow-lg shadow-orange-500/30">
                      <ShoppingCart size={14} /> {itemCount}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-xl truncate text-gray-900">{restaurant.name}</h4>
                  <p className="text-xs font-semibold text-orange-600 mt-1 mb-4 uppercase tracking-wider line-clamp-1">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 bg-gray-50 p-2.5 rounded-2xl">
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500">⏱</span> {restaurant.deliveryTime || '25-40 min'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500">🚲</span> {restaurant.deliveryFee === 0 || restaurant.deliveryFee === 'Free' ? 'Free' : (typeof restaurant.deliveryFee === 'number' ? `Rs. ${restaurant.deliveryFee}` : restaurant.deliveryFee)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
