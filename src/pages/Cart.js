import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => {
    // For now price is 0 → later replace with real price or item.price * quantity
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const formatPrice = (amount) => `Rs. ${amount.toFixed(0)}`;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-8">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-orange-600 transition active:scale-95"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-5 border-b border-gray-100 last:border-b-0"
          >
            {/* Item image / placeholder */}
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center text-gray-400">
              {/* Later: <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> */}
              <span className="text-2xl">🍽️</span>
            </div>

            {/* Item details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
              {item.restaurantName && (
                <p className="text-sm text-gray-600 mt-0.5">
                  From {item.restaurantName}
                </p>
              )}
              <p className="text-sm font-medium text-orange-600 mt-1">
                {formatPrice(item.price || 0)}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-1 py-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition disabled:opacity-40"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>

              <span className="w-10 text-center font-medium">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full transition"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
              title="Remove item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary & Checkout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6 text-lg">
          <span className="font-medium text-gray-800">Subtotal</span>
          <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-medium text-lg hover:bg-orange-600 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={subtotal === 0}
        >
          Proceed to Checkout
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Delivery fees and taxes will be calculated at checkout
        </p>
      </div>
    </div>
  );
}