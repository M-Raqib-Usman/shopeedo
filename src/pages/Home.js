import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, Store } from 'lucide-react';
import { getRestaurants, getCategories } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  // Emoji mapping for known category names
  const emojiMap = {
    'pizza': '🍕',
    'biryani': '🍲',
    'burgers': '🍔',
    'burger': '🍔',
    'groceries': '🛒',
    'desserts': '🍰',
    'dessert': '🍰',
    'chinese': '🥡',
    'fast food': '🍟',
    'drinks': '🥤',
    'beverages': '🥤',
    'bbq': '🍖',
    'karahi': '🍛',
    'paratha': '🫓',
    'shawarma': '🌯',
    'sandwich': '🥪',
    'pasta': '🍝',
    'ice cream': '🍦',
    'tea': '🍵',
    'coffee': '☕',
    'main course': '🍽️',
    'appetizers': '🥗',
    'sides': '🥙',
    'starters': '🥗',
    'seafood': '🦐',
    'desi': '🍛',
    'pakistani': '🇵🇰',
    'naan': '🫓',
    'rice': '🍚',
    'salad': '🥗',
    'soup': '🍜',
    'juices': '🧃',
    'smoothies': '🥤',
    'chicken': '🍗',
    'rolls': '🌯',
    'wraps': '🌮',
  };

  // Static fallback categories
  const staticCategories = [
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Biryani', emoji: '🍲' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Karahi', emoji: '🍛' },
    { name: 'BBQ', emoji: '🍖' },
    { name: 'Shawarma', emoji: '🌯' },
    { name: 'Sandwich', emoji: '🥪' },
    { name: 'Pasta', emoji: '🍝' },
    { name: 'Chinese', emoji: '🥡' },
    { name: 'Fast Food', emoji: '🍟' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Ice Cream', emoji: '🍦' },
    { name: 'Drinks', emoji: '🥤' },
    { name: 'Coffee', emoji: '☕' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Seafood', emoji: '🦐' },
    { name: 'Salad', emoji: '🥗' },
    { name: 'Smoothies', emoji: '🥤' }
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
            emoji: emojiMap[cat.toLowerCase()] || '🍴'
          }));
          setDynamicCategories(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback restaurants
        setRestaurants([
          { id: 1, name: 'Pizza Point Jahanian', cuisine: 'Pizza • Fast Food', rating: 4.6, deliveryTime: '20-35 min', deliveryFee: 'Rs. 99' },
          { id: 2, name: 'Biryani House', cuisine: 'Biryani • Pakistani', rating: 4.8, deliveryTime: '25-40 min', deliveryFee: 'Free' },
          { id: 3, name: 'Burger Lab', cuisine: 'Burgers • American', rating: 4.4, deliveryTime: '15-30 min', deliveryFee: 'Rs. 149' },
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
    return <div className="pt-12 text-center text-lg">Loading restaurants...</div>;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">

      {/* Promo Banner */}
      <div className="mx-4 mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl">
        <div className="p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">50% OFF on First Order!</h2>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-white text-orange-600 font-semibold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-gray-100 transition"
          >
            Order Now →
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="px-4 mb-10">
        <h3 className="text-xl font-bold mb-5 px-1">What are you craving?</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 sm:-mx-4 sm:px-4">
          {categoriesToShow.map((item) => {
            const name = typeof item === 'string' ? item : item.name;
            const emoji = typeof item === 'string' ? emojiMap[item.toLowerCase()] : item.emoji;
            return (
              <button
                key={name}
                onClick={() => navigate(`/category/${name.toLowerCase()}`)}
                className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 bg-white rounded-full shadow-sm border hover:shadow-md transition"
              >
                {emoji ? <span className="text-2xl mb-1">{emoji}</span> : <Store size={24} className="text-gray-500 mb-1" />}
                <span className="mt-1 text-xs font-medium capitalize text-gray-800 text-center leading-tight">{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Restaurants from Backend */ }
  <div className="px-4">
    <h3 className="text-xl font-bold mb-5 px-1">Popular near you</h3>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {restaurants.map((restaurant) => {
        const itemCount = getRestaurantItemCount(restaurant.id);

        return (
          <div
            key={restaurant.id}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="relative">
              <img
                src={restaurant.image || `https://via.placeholder.com/300x180?text=${restaurant.name}`}
                alt={restaurant.name}
                className="w-full h-44 object-cover"
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

            <div className="p-4">
              <h4 className="font-semibold text-lg truncate">{restaurant.name}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{restaurant.cuisine}</p>
              <div className="flex justify-between mt-4 text-sm text-gray-700">
                <span>⏱ {restaurant.deliveryTime || '25-40 min'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
    </div >
  );
}