import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRestaurantById } from '../services/api';

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
      <div className="relative">
        <img
          src={restaurant.image || `https://via.placeholder.com/600x200?text=${restaurant.name}`}
          alt={restaurant.name}
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-2">{restaurant.cuisine}</p>
          <div className="flex items-center gap-4 text-sm">
            <span>⭐ {restaurant.rating || '4.5'}</span>
            <span>• {restaurant.deliveryTime || '25-40 min'}</span>
            <span>• {restaurant.deliveryFee || 'Rs. 99'}</span>
          </div>
        </div>
      </div>

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
        {menuCategories.map((section) => (
          <div key={section.category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              {section.category}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((dish) => {
                const currentQuantity = getItemQuantity(
                  dish._id || dish.id, 
                  restaurant._id || restaurant.id
                );

                return (
                  <div key={dish._id || dish.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition">
                    <img
                      src={dish.image || `https://via.placeholder.com/300x200?text=${dish.name}`}
                      alt={dish.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                      {dish.desc && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dish.desc}</p>}
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-bold text-xl text-orange-600">Rs. {dish.price}</span>

                        {currentQuantity > 0 ? (
                          <div className="flex items-center bg-orange-50 border border-orange-200 rounded-2xl px-1">
                            <button 
                              onClick={() => updateQuantity(
                                dish._id || dish.id, 
                                restaurant._id || restaurant.id, 
                                currentQuantity - 1
                              )} 
                              className="w-9 h-9 flex items-center justify-center text-orange-600"
                            >
                              <Minus size={20} />
                            </button>
                            <span className="w-10 text-center font-semibold">{currentQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(
                                dish._id || dish.id, 
                                restaurant._id || restaurant.id, 
                                currentQuantity + 1
                              )} 
                              className="w-9 h-9 flex items-center justify-center text-orange-600"
                            >
                              <Plus size={20} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}