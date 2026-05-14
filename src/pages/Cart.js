import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import SmartImage from '../components/SmartImage';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    getGroupedCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const groupedCart = getGroupedCart();
  const totalSubtotal = groupedCart.reduce((sum, group) => sum + group.subtotal, 0);
  const deliveryFees = groupedCart.length * 99;        // Rs.99 per restaurant
  const grandTotal = totalSubtotal + deliveryFees;

  const handleQuantityChange = (itemId, restaurantId, newQuantity) => {
    updateQuantity(itemId, restaurantId, newQuantity);
    if (newQuantity === 0) {
      toast.error("Item removed from cart");
    } else {
      toast.success("Quantity updated");
    }
  };

  const handleRemove = (itemId, restaurantId, itemName) => {
    removeFromCart(itemId, restaurantId);
    toast.error(`${itemName} removed`);
  };

  if (groupedCart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold mb-3 text-gray-800">Your cart is empty</h2>
        <p className="text-gray-600 text-center mb-8 max-w-xs">
          Looks like you haven't added anything yet. 
          Start adding delicious items!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3.5 rounded-2xl font-semibold transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-orange-50 transition">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold text-lg">My Cart</span>
          </button>
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-bold text-sm">
            {groupedCart.reduce((sum, g) => sum + g.items.length, 0)} items
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Multi-Restaurant Warning */}
        {groupedCart.length > 1 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl mb-6 text-sm">
            ⚠️ You have items from multiple restaurants. They may arrive at different times.
          </div>
        )}

        {/* Cart Items Grouped by Restaurant */}
        {groupedCart.map((group) => (
          <div key={group.restaurantId} className="mb-10 bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-orange-500 text-white px-6 py-4 font-semibold">
              {group.restaurantName}
            </div>

            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {group.items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 flex gap-5 items-center"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full"
                        fallbackText={item.name}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{item.name}</h3>
                      <p className="text-gray-500 font-medium text-sm">
                        Rs. {item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="font-black text-xl text-orange-600 tracking-tight">
                        Rs. {item.price * item.quantity}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                        <button
                          onClick={() => handleQuantityChange(item.id, group.restaurantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-gray-600 transition"
                        >
                          <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, group.restaurantId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-orange-600 transition"
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id, group.restaurantId, item.name)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1 transition"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between text-sm">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">Rs. {group.subtotal}</span>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-lg mb-4">Bill Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {totalSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee ({groupedCart.length} restaurant{groupedCart.length > 1 ? 's' : ''})</span>
              <span>Rs. {deliveryFees}</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span>Rs. {grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Proceed to Checkout Button */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-4 rounded-3xl font-semibold text-lg shadow-lg transition mb-6"
        >
          Proceed to Checkout • Rs. {grandTotal}
        </button>

        <p className="text-center text-xs text-gray-500 pb-10">
          Your order will be prepared by the respective restaurants
        </p>
      </div>
    </div>
  );
}