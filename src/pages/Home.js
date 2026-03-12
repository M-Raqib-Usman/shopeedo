import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fake data - later replace with API fetch
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
      image: 'https://via.placeholder.com/300x180?text=Pizza',
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
      image: 'https://via.placeholder.com/300x180?text=Burger',
    },
    {
      id: 4,
      name: 'Fresh Mart Grocery',
      cuisine: 'Groceries • Essentials',
      rating: 4.7,
      deliveryTime: '10-25 min',
      deliveryFee: 'Rs. 49',
      image: 'https://via.placeholder.com/300x180?text=Grocery',
    },
  ];

  return (
    <div className="pt-4 pb-12">

      {/* 1. Promo Banner */}
      <div className="mx-4 mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg">
        <div className="p-6 md:p-10 text-center md:text-left relative">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3 drop-shadow-md">
            Cravings? Get 50% OFF!
          </h2>
          <p className="text-base md:text-lg mb-4 opacity-90">
            First order? Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">FIRST50</span>
          </p>
          <p className="text-sm opacity-80">Min. order Rs. 300 • Limited time!</p>

          <button className="mt-5 bg-white text-orange-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition active:scale-95">
            Order Now
          </button>
        </div>
      </div>

      {/* 2. Category Chips */}
      <div className="px-4 mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
          What are you in the mood for?
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="flex-shrink-0 snap-center flex flex-col items-center bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-200 min-w-[100px] active:scale-95"
            >
              <span className="text-4xl mb-2">{cat.emoji}</span>
              <span className="text-sm font-medium text-gray-800">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Popular Restaurants – clickable cards with Add to Cart button */}
      <div className="px-4 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Popular near Jahanian
          </h3>
          <button className="text-orange-600 text-sm font-medium hover:underline">
            See all →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {restaurant.rating} ★
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-base md:text-lg truncate">
                  {restaurant.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1 truncate">{restaurant.cuisine}</p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                  <span className="font-medium">{restaurant.deliveryTime}</span>
                  <span>•</span>
                  <span className={restaurant.deliveryFee === 'Free' ? 'text-green-600 font-medium' : ''}>
                    {restaurant.deliveryFee}
                  </span>
                </div>

                {/* Add to Cart button */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click (navigation) when button is clicked
                      addToCart({
                        id: `restaurant-${restaurant.id}`,
                        name: `Order from ${restaurant.name}`,
                        price: 0, // placeholder – later use real price or menu item price
                        restaurantId: restaurant.id,
                      });
                    }}
                    className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition active:scale-95"
                  >
                    Add to Cart
                  </button>

                  <span className="text-sm font-medium text-gray-700">
                    {restaurant.deliveryFee === 'Free' ? 'Free Delivery' : restaurant.deliveryFee}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}