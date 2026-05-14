import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getRestaurants } from '../services/api';
import { useCart } from '../context/CartContext';

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
    return <div className="pt-12 text-center text-lg">Loading restaurants...</div>;
  }

  return (
    <div className="pt-4 pb-12 bg-gray-50 min-h-screen">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">All Restaurants</h2>
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
                    <span className={restaurant.deliveryFee === 'Free' || restaurant.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {restaurant.deliveryFee ? `Rs. ${restaurant.deliveryFee}` : 'Free'}
                    </span>
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
