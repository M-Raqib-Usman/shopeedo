// src/pages/CategoryPage.js

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getMenuByCategory } from '../services/api';
import { Plus, Minus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import SmartImage from '../components/SmartImage';

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getMenuByCategory(name);
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch category items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [name]);

  const handleAddToCart = (item) => {
    const savedUser = localStorage.getItem('shopeedo-user');
    if (!savedUser) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      desc: '',
      image: item.image || '',
      restaurantId: item.restaurant?.id || item.restaurantId,
      restaurantName: item.restaurant?.name || 'Unknown',
    });
    toast.success(`${item.name} added to cart 🛒`);
  };

  // Group items by restaurant
  const groupedByRestaurant = items.reduce((groups, item) => {
    const rName = item.restaurant?.name || 'Other';
    if (!groups[rName]) {
      groups[rName] = { restaurant: item.restaurant, items: [] };
    }
    groups[rName].items.push(item);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="pt-12 text-center text-lg text-gray-500">
        Loading {name} items...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize">
          {name}
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No items found</h2>
          <p className="text-gray-500 mb-6">
            No vendors have added items in the <strong className="capitalize">{name}</strong> category yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-medium transition"
          >
            Browse other categories
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedByRestaurant).map(([restaurantName, group]) => (
            <div key={restaurantName}>
              {/* Restaurant header */}
              <div
                className="flex items-center gap-4 mb-6 cursor-pointer group"
                onClick={() => group.restaurant?.id && navigate(`/restaurant/${group.restaurant.id}`)}
              >
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 font-bold text-xl group-hover:bg-orange-200 transition">
                  {restaurantName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">{restaurantName}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {group.restaurant?.rating && <span>⭐ {group.restaurant.rating}</span>}
                    {group.restaurant?.deliveryTime && <span>⏱ {group.restaurant.deliveryTime}</span>}
                    {group.restaurant?.deliveryFee !== undefined && (
                      <span className={group.restaurant.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
                        {group.restaurant.deliveryFee === 0 ? 'Free Delivery' : `Rs. ${group.restaurant.deliveryFee}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {group.items.map((item) => {
                  const currentQuantity = getItemQuantity(item._id, item.restaurant?.id || item.restaurantId);

                  return (
                    <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all">
                      <div className="h-44 bg-gray-100 relative">
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full"
                          fallbackText={item.name}
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-600 capitalize">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{restaurantName}</p>

                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xl text-orange-600">Rs. {item.price}</span>

                          {currentQuantity > 0 ? (
                            <div className="flex items-center bg-orange-50 border border-orange-200 rounded-2xl px-1">
                              <button
                                onClick={() => updateQuantity(item._id, item.restaurant?.id || item.restaurantId, currentQuantity - 1)}
                                className="w-9 h-9 flex items-center justify-center text-orange-600"
                              >
                                <Minus size={18} />
                              </button>
                              <span className="w-8 text-center font-semibold">{currentQuantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.restaurant?.id || item.restaurantId, currentQuantity + 1)}
                                className="w-9 h-9 flex items-center justify-center text-orange-600"
                              >
                                <Plus size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-semibold transition text-sm"
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
      )}
    </div>
  );
}