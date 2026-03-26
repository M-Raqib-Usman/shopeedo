import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    getItemQuantity,
    getGroupedCart 
  } = useCart();

  const restaurant = {
    id: Number(id),
    name: id === '1' ? 'Pizza Point Jahanian' : 'Example Restaurant',
    cuisine: 'Pizza • Fast Food • Italian',
    rating: 4.6,
    reviewCount: 342,
    deliveryTime: '20–35 min',
    deliveryFee: 'Rs. 99',
    minOrder: 300,
    image: 'https://via.placeholder.com/600x200?text=Restaurant+Header',
  };

  const menuCategories = [
    {
      category: 'Starters',
      items: [
        { id: 's1', name: 'Garlic Bread', price: 250, desc: 'Freshly baked with garlic butter' },
        { id: 's2', name: 'Chicken Wings', price: 420, desc: 'Spicy BBQ sauce' },
      ],
    },
    {
      category: 'Pizzas',
      items: [
        { id: 'p1', name: 'Margherita', price: 890, desc: 'Tomato, mozzarella, basil' },
        { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Extra cheese & pepperoni' },
        { id: 'p3', name: 'BBQ Chicken', price: 1190, desc: 'BBQ sauce, chicken, onions' },
      ],
    },
    {
      category: 'Burgers',
      items: [
        { id: 'b1', name: 'Classic Beef Burger', price: 650, desc: 'Beef patty, cheese, veggies' },
        { id: 'b2', name: 'Chicken Zinger', price: 580, desc: 'Crispy chicken fillet' },
      ],
    },
    {
      category: 'Drinks',
      items: [
        { id: 'd1', name: 'Soft Drink 500ml', price: 120, desc: '' },
        { id: 'd2', name: 'Fresh Lime', price: 180, desc: '' },
      ],
    },
  ];

  const handleAddToCart = (dish) => {
    addToCart(dish, restaurant.id, restaurant.name);
    toast.success(`${dish.name} added to cart 🛒`);
  };

  const handleQuantityChange = (dish, newQuantity, currentQuantity) => {
    updateQuantity(dish.id, restaurant.id, newQuantity);
    if (newQuantity > currentQuantity) {
      toast.success(`+1 ${dish.name}`);
    } else if (newQuantity < currentQuantity && newQuantity > 0) {
      toast(`${dish.name} quantity decreased`);
    }
  };

  const handleRemove = (dish) => {
    removeFromCart(dish.id, restaurant.id);
    toast.error(`${dish.name} removed`);
  };

  // Get current restaurant's cart group
  const currentGroup = getGroupedCart().find(g => g.restaurantId === restaurant.id);
  const hasItems = !!currentGroup;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">

      {/* Restaurant Header */}
      <div className="relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 md:h-64 object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-3">{restaurant.cuisine}</p>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <div>⭐ {restaurant.rating} ({restaurant.reviewCount})</div>
            <div>⏱ {restaurant.deliveryTime}</div>
            <div>🚚 {restaurant.deliveryFee}</div>
          </div>
        </div>
      </div>

      {/* Back + Min Order */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
          ← Back
        </button>
        <div className="text-gray-600">
          Min. order: <span className="font-medium">Rs. {restaurant.minOrder}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {menuCategories.map((section) => (
          <div key={section.category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((dish) => {
                const currentQuantity = getItemQuantity(dish.id, restaurant.id);
                return (
                  <div key={dish.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100">
                    <img src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(dish.name)}`} alt={dish.name} className="w-full h-48 object-cover" />
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                      {dish.desc && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dish.desc}</p>}
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-bold text-xl text-orange-600">Rs. {dish.price}</span>
                        {currentQuantity > 0 ? (
                          <div className="flex items-center bg-orange-50 border border-orange-200 rounded-2xl px-1 py-1">
                            <button onClick={() => handleQuantityChange(dish, currentQuantity - 1, currentQuantity)} className="w-9 h-9 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-xl">
                              <Minus size={20} />
                            </button>
                            <span className="w-10 text-center font-semibold text-orange-700">{currentQuantity}</span>
                            <button onClick={() => handleQuantityChange(dish, currentQuantity + 1, currentQuantity)} className="w-9 h-9 flex items-center justify-center text-orange-600 hover:bg-orange-100 rounded-xl">
                              <Plus size={20} />
                            </button>
                            {currentQuantity === 1 && (
                              <button onClick={() => handleRemove(dish)} className="ml-2 text-red-500 hover:text-red-600">
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button onClick={() => handleAddToCart(dish)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition">
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

      {/* Improved Floating Cart Bar */}
      {hasItems && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50 md:hidden">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">
                {currentGroup.items.reduce((sum, item) => sum + item.quantity, 0)} items • Rs. {currentGroup.subtotal}
              </div>
              <div className="text-sm text-gray-600">from {restaurant.name}</div>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-semibold transition"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}