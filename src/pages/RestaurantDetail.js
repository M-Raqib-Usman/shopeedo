import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, Clock, DollarSign, ArrowLeft } from 'lucide-react';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  // Fake restaurant data (in real app → fetch by id)
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

  // Fake menu grouped by category
  const menuCategories = [
    {
      category: 'Starters',
      items: [
        { id: 's1', name: 'Garlic Bread', price: 250, desc: 'Freshly baked with garlic butter', image: 'https://via.placeholder.com/300x200?text=Garlic+Bread' },
        { id: 's2', name: 'Chicken Wings', price: 420, desc: 'Spicy BBQ sauce', image: 'https://via.placeholder.com/300x200?text=Chicken+Wings' },
      ],
    },
    {
      category: 'Pizzas',
      items: [
        { id: 'p1', name: 'Margherita', price: 890, desc: 'Tomato, mozzarella, basil', image: 'https://via.placeholder.com/300x200?text=Margherita' },
        { id: 'p2', name: 'Pepperoni', price: 1090, desc: 'Extra cheese & pepperoni', image: 'https://via.placeholder.com/300x200?text=Pepperoni' },
        { id: 'p3', name: 'BBQ Chicken', price: 1190, desc: 'BBQ sauce, chicken, onions', image: 'https://via.placeholder.com/300x200?text=BBQ+Chicken' },
      ],
    },
    {
      category: 'Burgers',
      items: [
        { id: 'b1', name: 'Classic Beef Burger', price: 650, desc: 'Beef patty, cheese, veggies', image: 'https://via.placeholder.com/300x200?text=Beef+Burger' },
        { id: 'b2', name: 'Chicken Zinger', price: 580, desc: 'Crispy chicken fillet', image: 'https://via.placeholder.com/300x200?text=Zinger' },
      ],
    },
    {
      category: 'Drinks',
      items: [
        { id: 'd1', name: 'Soft Drink 500ml', price: 120, desc: '', image: 'https://via.placeholder.com/300x200?text=Soft+Drink' },
        { id: 'd2', name: 'Fresh Lime', price: 180, desc: '', image: 'https://via.placeholder.com/300x200?text=Lime' },
      ],
    },
  ];

  // Calculate cart summary for this restaurant only (optional enhancement)
  const cartForThisRestaurant = cartItems.filter(item => item.restaurantId === restaurant.id);
  const itemCount = cartForThisRestaurant.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cartForThisRestaurant.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">

      {/* Restaurant Header */}
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg opacity-90 mb-3">{restaurant.cuisine}</p>
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating} ({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={18} />
              <span>Delivery: {restaurant.deliveryFee}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back button & min order info */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between text-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
        >
          ← Back to home
        </button>
        <div className="text-gray-600">
          Min. order: <span className="font-medium">Rs. {restaurant.minOrder}</span>
        </div>
      </div>

      {/* Menu Categories & Items */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {menuCategories.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold mb-5 text-gray-800 border-b border-gray-200 pb-3">
              {section.category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                    {dish.desc && <p className="text-sm text-gray-600 mb-3">{dish.desc}</p>}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600 text-lg">
                        Rs. {dish.price}
                      </span>
                      <button
                        onClick={() =>
                          addToCart({
                            id: dish.id,
                            name: dish.name,
                            price: dish.price,
                            quantity: 1,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                          })
                        }
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-medium transition active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart summary (mobile) */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 md:hidden z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-medium">
                {itemCount} item{itemCount !== 1 ? 's' : ''} • Rs. {subtotal}
              </div>
              <div className="text-sm text-gray-600">from {restaurant.name}</div>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}