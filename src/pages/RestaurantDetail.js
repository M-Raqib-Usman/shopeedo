import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRestaurantById } from '../services/api';
import SmartImage from '../components/SmartImage';
import { motion } from 'framer-motion';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    addToCart, 
    updateQuantity, 
    getItemQuantity 
  } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantById(id);
        
        setRestaurant(data);

        // Use menuCategories from backend if available, else fallback
        if (data.menuCategories && data.menuCategories.length > 0) {
          setMenuCategories(data.menuCategories);
        } else if (data.menu && data.menu.length > 0) {
          setMenuCategories([{
            category: 'All Items',
            items: data.menu
          }]);
        } else {
          setMenuCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleAddToCart = (dish) => {
    if (!restaurant) return;
  const savedUser = localStorage.getItem('shopeedo-user');
  
  if (!savedUser) {
    toast.error("Please login to add items to cart", {
      duration: 3000,
    });
    navigate('/auth');
    return;
  }
  
    addToCart({
      id: dish._id || dish.id,
      name: dish.name,
      price: dish.price,
      desc: dish.desc || '',
      image: dish.image || '',
      restaurantId: restaurant._id || restaurant.id,        // ← Critical fix
      restaurantName: restaurant.name,
    });

    toast.success(`${dish.name} added to cart 🛒`);
  };

  if (loading) return <div className="pt-28 text-center py-20">Loading restaurant menu...</div>;
  if (error) return <div className="pt-28 text-center py-20 text-red-600">{error}</div>;
  if (!restaurant) return <div className="pt-28 text-center py-20">Restaurant not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Restaurant Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-64 md:h-80 overflow-hidden"
      >
        <SmartImage
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full"
          fallbackText={restaurant.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-3">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold">
              <span className="bg-orange-500 px-3 py-1 rounded-lg">⭐ {restaurant.rating || '4.5'}</span>
              <span className="opacity-80">{restaurant.cuisine}</span>
              <span className="opacity-80">• {restaurant.deliveryTime || '25-40 min'}</span>
              <span className="opacity-80">• {restaurant.deliveryFee || 'Rs. 99'}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-orange-600 font-medium flex items-center gap-2 hover:text-orange-700"
        >
          ← Back to home
        </button>
      </div>

      {/* Menu */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {menuCategories.map((section, sIndex) => (
          <motion.div 
            key={section.category} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (sIndex * 0.1) }}
            className="mb-12"
          >
            <h2 className="text-2xl font-black mb-6 text-gray-900 border-b-4 border-orange-500 w-fit pb-2">
              {section.category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((dish, dIndex) => {
                const currentQuantity = getItemQuantity(
                  dish._id || dish.id, 
                  restaurant._id || restaurant.id
                );

                return (
                  <motion.div 
                    key={dish._id || dish.id} 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 group"
                  >
                    <div className="relative overflow-hidden h-52">
                      <SmartImage
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                        fallbackText={dish.name}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{dish.name}</h3>
                      {dish.desc && <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{dish.desc}</p>}
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-black text-2xl text-orange-500 tracking-tight">Rs. {dish.price}</span>

                        {currentQuantity > 0 ? (
                          <div className="flex items-center bg-orange-50 border-2 border-orange-200 rounded-2xl px-1">
                            <button 
                              onClick={() => updateQuantity(
                                dish._id || dish.id, 
                                restaurant._id || restaurant.id, 
                                currentQuantity - 1
                              )} 
                              className="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-xl transition"
                            >
                              <Minus size={20} strokeWidth={3} />
                            </button>
                            <span className="w-10 text-center font-black text-lg">{currentQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(
                                dish._id || dish.id, 
                                restaurant._id || restaurant.id, 
                                currentQuantity + 1
                              )} 
                              className="w-10 h-10 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-xl transition"
                            >
                              <Plus size={20} strokeWidth={3} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-2xl font-bold transition shadow-lg shadow-orange-200 transform active:scale-95"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}