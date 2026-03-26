import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { cartItems } = useCart();   
  
  // Fake data
  const categories = [
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Biryani', emoji: '🍲' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Chinese', emoji: '🥡' },
    { name: 'Fast Food', emoji: '🍟' },
    { name: 'Drinks', emoji: '🥤' },
    { name: 'Healthy', emoji: '🥗' },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Pizza Point Jahanian',
      cuisine: 'Pizza • Fast Food',
      rating: 4.6,
      deliveryTime: '20-35 min',
      deliveryFee: 'Rs. 99',
      image: 'https://via.placeholder.com/300x180?text=Pizza+Point',
    },
    {
      id: 2,
      name: 'Biryani House',
      cuisine: 'Biryani • Pakistani',
      rating: 4.8,
      deliveryTime: '25-40 min',
      deliveryFee: 'Free',
      image: 'https://via.placeholder.com/300x180?text=Biryani',
    },
    {
      id: 3,
      name: 'Burger Lab',
      cuisine: 'Burgers • American',
      rating: 4.4,
      deliveryTime: '15-30 min',
      deliveryFee: 'Rs. 149',
      image: 'https://via.placeholder.com/300x180?text=Burger+Lab',
    },
    {
      id: 4,
      name: 'Fresh Mart Grocery',
      cuisine: 'Groceries • Essentials',
      rating: 4.7,
      deliveryTime: '10-25 min',
      deliveryFee: 'Rs. 49',
      image: 'https://via.placeholder.com/300x180?text=Fresh+Mart',
    },
  ];

  // Helper: Get total quantity from a specific restaurant
  const getRestaurantItemCount = (restaurantId) => {
    return cartItems
      .filter(item => item.restaurantId === restaurantId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">

      {/* 1. Promo Banner */}
      <div className="mx-4 mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-xl">
        <div className="p-8 md:p-12 text-center relative">
          <div className="absolute top-4 right-4 bg-white/20 px-4 py-1 rounded-full text-sm font-medium">
            Limited Time
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            50% OFF on First Order!
          </h2>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Use code <span className="font-bold bg-white/30 px-3 py-1 rounded-lg">FIRST50</span>
          </p>
          <button
            onClick={() => navigate('/restaurant/1')}
            className="mt-5 bg-white text-orange-700 font-semibold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-gray-100 transition active:scale-95 text-base font-medium"
          >
            Order Now from Pizza Point →
          </button>
        </div>
      </div>

      {/* 2. Category Chips */}
      <div className="px-4 mb-10">
        <h3 className="text-xl font-bold mb-5 text-gray-800 px-1">
          What are you craving?
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
              className="flex-shrink-0 snap-center flex flex-col items-center bg-white rounded-3xl px-6 py-5 shadow-sm border border-gray-100 hover:border-orange-400 hover:shadow-md transition-all min-w-[110px]"
            >
              <span className="text-4xl mb-3">{cat.emoji}</span>
              <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Popular Restaurants */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-gray-800">
            Popular near you
          </h3>
          <span className="text-orange-600 text-sm font-medium">See all →</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {restaurants.map((restaurant) => {
            const itemCount = getRestaurantItemCount(restaurant.id);

            return (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white text-black text-xs font-bold px-3 py-1 rounded-2xl shadow flex items-center gap-1">
                    ⭐ {restaurant.rating}
                  </div>

                  {/* Quantity Badge - Shows if items added from this restaurant */}
                  {itemCount > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-2xl shadow flex items-center gap-1">
                      <ShoppingCart size={14} />
                      {itemCount}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-900 truncate">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {restaurant.cuisine}
                  </p>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span>⏱ {restaurant.deliveryTime}</span>
                    </div>
                    <div className={`font-medium ${restaurant.deliveryFee === 'Free' ? 'text-green-600' : 'text-gray-700'}`}>
                      {restaurant.deliveryFee}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}