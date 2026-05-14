import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Store } from 'lucide-react';
import { getRestaurants, getCategories } from '../services/api';
import SmartImage from '../components/SmartImage';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

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

export default function Home() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState([]);



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

  // Fetch restaurants and categories from backend
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, categoryData] = await Promise.all([
          getRestaurants(),
          getCategories()
        ]);
        setRestaurants(restaurantData);

        if (categoryData && categoryData.length > 0) {
          const mapped = categoryData.map(cat => ({
            name: cat,
            image: imageMap[cat.toLowerCase()] || imageMap.default
          }));
          setDynamicCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback restaurants
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

  const categoriesToShow = dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

  const getRestaurantItemCount = (restaurantId) => {
    return cartItems.filter(item => item.restaurantId === restaurantId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return <Loader fullPage message="Finding top restaurants in Sahiwal..." />;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">

      {/* Enhanced Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-4 mb-12 relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-2xl group"
      >
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
          alt="Delicious Food"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 inline-block">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              Get <span className="text-orange-500">50% OFF</span><br />
              on First Order!
            </h2>
            <button
              onClick={() => navigate('/restaurants')}
              className="bg-white text-gray-900 font-bold px-10 py-4 rounded-2xl shadow-xl hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 w-fit"
            >
              Order Now <span className="text-xl">→</span>
            </button>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-20 hidden lg:block animate-float">
          <div className="glass-dark p-4 rounded-3xl text-center">
            <span className="text-3xl">🍕</span>
            <p className="text-[10px] font-bold uppercase mt-1">Hot Pizza</p>
          </div>
        </div>
      </motion.div>

      {/* Category Chips */}
      <div className="px-4 mb-10">
        <h3 className="text-xl font-bold mb-5 px-1">What are you craving?</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 sm:-mx-4 sm:px-4">
          {categoriesToShow.map((item, index) => {
            const name = typeof item === 'string' ? item : item.name;
            const image = typeof item === 'string' ? (imageMap[item.toLowerCase()] || imageMap.default) : item.image;
            return (
              <motion.button
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/category/${name.toLowerCase()}`)}
                className="flex-shrink-0 flex flex-col items-center justify-end w-28 h-36 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 z-0">
                  <SmartImage src={image} fallbackText={name} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <span className="relative z-20 text-[13px] font-black capitalize text-white text-center pb-4 tracking-wide group-hover:text-orange-400 transition-colors drop-shadow-md">{name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Popular Restaurants from Backend */ }
  <div className="px-4">
    <h3 className="text-xl font-bold mb-5 px-1">Popular near you</h3>

    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
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
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="relative">
              <SmartImage
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-44"
                fallbackText={restaurant.name}
              />
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-2xl text-xs font-bold shadow flex items-center gap-1">
                ⭐ {restaurant.rating}
              </div>
              {itemCount > 0 && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-2xl flex items-center gap-1">
                  <ShoppingCart size={14} /> {itemCount}
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-xl truncate text-gray-900">{restaurant.name}</h4>
              </div>
              <p className="text-xs font-semibold text-orange-600 mb-3 uppercase tracking-wider">{restaurant.cuisine}</p>
              
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
    </div >
  );
}