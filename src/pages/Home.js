import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles, Zap } from 'lucide-react';
import { getRestaurants, getCategories } from '../services/api';
import SmartImage from '../components/SmartImage';
import { RestaurantSkeleton, CategorySkeleton } from '../components/Skeleton';
import { motion } from 'framer-motion';
import { getCategoryImage } from '../utils/imageUtils';

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  // Static fallback categories
  const staticCategories = [
    { name: 'Pizza', image: getCategoryImage('pizza') },
    { name: 'Biryani', image: getCategoryImage('biryani') },
    { name: 'Burgers', image: getCategoryImage('burgers') },
    { name: 'Desserts', image: getCategoryImage('desserts') },
    { name: 'Drinks', image: getCategoryImage('drinks') },
    { name: 'Chinese', image: getCategoryImage('chinese') },
    { name: 'BBQ', image: getCategoryImage('bbq') },
    { name: 'Groceries', image: getCategoryImage('groceries') }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantData, categoryData] = await Promise.all([
          getRestaurants(),
          getCategories()
        ]);
        setRestaurants(restaurantData);
        setFilteredRestaurants(restaurantData);

        if (categoryData && categoryData.length > 0) {
          const mapped = categoryData.map(cat => ({
            name: cat,
            image: getCategoryImage(cat)
          }));
          setDynamicCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter restaurants based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = restaurants.filter(res => 
        res.name.toLowerCase().includes(query) || 
        res.cuisine.toLowerCase().includes(query)
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const categoriesToShow = dynamicCategories.length > 0 ? dynamicCategories : staticCategories;

  const getRestaurantItemCount = (restaurantId) => {
    return cartItems.filter(item => item.restaurantId === restaurantId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

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
            <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 inline-block shadow-lg">
              Flash Deal
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              Get <span className="text-orange-500">FREE DELIVERY</span><br />
              on your first 3 orders!
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
          <div className="glass-dark p-4 rounded-3xl text-center shadow-2xl border border-white/20">
            <span className="text-3xl">🍔</span>
            <p className="text-[10px] font-bold uppercase mt-1">Juicy Deals</p>
          </div>
        </div>
      </motion.div>

      {/* Category Chips */}
      <div className="px-4 mb-10">
        <h3 className="text-xl font-bold mb-5 px-1 flex items-center gap-2">
          What are you craving? <Zap size={18} className="text-orange-500" />
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 sm:-mx-4 sm:px-4 hide-scrollbar">
          {loading ? (
             [...Array(8)].map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categoriesToShow.map((item, index) => {
              const name = typeof item === 'string' ? item : item.name;
              const image = typeof item === 'string' ? getCategoryImage(item) : (item.image || getCategoryImage(name));
              return (
                <motion.button
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/category/${name.toLowerCase()}`)}
                  className="flex-shrink-0 flex flex-col items-center justify-end w-28 h-36 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 z-0">
                    <SmartImage src={image} fallbackText={name} className="w-full h-full group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <span className="relative z-20 text-[13px] font-black capitalize text-white text-center pb-4 tracking-wide group-hover:text-orange-400 transition-colors drop-shadow-md">{name}</span>
                </motion.button>
              );
            })
          )}
        </div>
      </div>

      {/* Popular Restaurants from Backend */}
      <div className="px-4 mb-16">
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            {searchQuery ? `Search results for "${searchQuery}"` : "Popular near you"} 
            {!searchQuery && <Sparkles size={18} className="text-orange-500" />}
          </h3>
          <button onClick={() => navigate('/restaurants')} className="text-orange-600 text-sm font-bold hover:underline">View All</button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            [...Array(8)].map((_, i) => <RestaurantSkeleton key={i} />)
          ) : filteredRestaurants.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 text-lg">No restaurants found matching "{searchQuery}"</p>
              <button onClick={() => navigate('/')} className="mt-4 text-orange-500 font-bold hover:underline">Clear Search</button>
            </div>
          ) : (
            filteredRestaurants.map((restaurant, idx) => {
              const itemCount = getRestaurantItemCount(restaurant.id);
              // Dynamic tags for visual interest
              const isFeatured = idx % 3 === 0;
              const isNew = idx === 1 || idx === 5;

              return (
                <motion.div
                  key={restaurant.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
                >
                  <div className="relative">
                    <SmartImage
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48"
                      fallbackText={restaurant.name}
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[11px] font-black shadow-lg flex items-center gap-1 text-gray-900">
                      <span className="text-orange-500 text-sm">⭐</span> {restaurant.rating}
                    </div>
                    
                    {/* Visual Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {itemCount > 0 && (
                        <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg shadow-orange-500/20">
                          <ShoppingCart size={12} /> {itemCount} IN CART
                        </div>
                      )}
                      {isFeatured && (
                        <div className="bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg">
                          <Sparkles size={12} className="text-orange-500" /> FEATURED
                        </div>
                      )}
                      {isNew && (
                        <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-lg">
                          <Zap size={12} /> NEW
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-bold text-xl truncate text-gray-900 group-hover:text-orange-600 transition-colors mb-1">{restaurant.name}</h4>
                    <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">{restaurant.cuisine}</p>

                    <div className="flex items-center gap-4 text-[11px] font-black text-gray-500 bg-gray-50 p-3 rounded-2xl group-hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="text-orange-500 text-lg">⏱</span> {restaurant.deliveryTime || '25-40 min'}
                      </div>
                      <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                        <span className="text-orange-500 text-lg">🚲</span> {restaurant.deliveryFee === 0 || restaurant.deliveryFee === 'Free' ? 'FREE' : (typeof restaurant.deliveryFee === 'number' ? `Rs. ${restaurant.deliveryFee}` : restaurant.deliveryFee)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>


      {/* How it Works Section */}
      <div className="px-6 mb-20">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-black text-xs uppercase tracking-[0.3em]">Our Process</span>
          <h3 className="text-3xl font-black text-gray-900 mt-2">How Shopeedo Works</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '📱', title: 'Choose Your Food', desc: 'Browse through hundreds of restaurants and thousands of dishes in Sahiwal.' },
            { icon: '🥘', title: 'Fresh Preparation', desc: 'Our vendor partners start preparing your meal immediately with fresh ingredients.' },
            { icon: '🚀', title: 'Super Fast Delivery', desc: 'Our dedicated riders ensure your food reaches you hot and fresh within minutes.' }
          ].map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center relative overflow-hidden group"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-orange-500 group-hover:rotate-12 transition-all duration-300">
                {step.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              <div className="absolute -bottom-4 -right-4 text-6xl font-black text-gray-50 opacity-10 group-hover:text-orange-100 transition-colors">{i+1}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Join the Team Section */}
      <div className="px-4 mb-12">
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Grow your business <br />
                with <span className="text-orange-500 text-gradient">Shopeedo</span>
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-lg">
                Join our network of elite restaurants and riders. Reach thousands of customers and increase your earnings today.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/vendor-login')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                >
                  Partner as Restaurant
                </button>
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all backdrop-blur-md active:scale-95"
                >
                  Join as Rider
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <motion.div 
                  animate={{ y: [0, -20, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl"
                >
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-white">V</div>
                      <div>
                        <p className="text-white font-bold">New Partner Request</p>
                        <p className="text-gray-400 text-xs">Approved • 2m ago</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-4 bg-white/10 rounded-full w-full" />
                      <div className="h-4 bg-white/10 rounded-full w-3/4" />
                      <div className="h-4 bg-white/10 rounded-full w-1/2" />
                   </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}