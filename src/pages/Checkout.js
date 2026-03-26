import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { getGroupedCart, cartItems, cartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("House 123, Street 5, Khanewal");

  const groupedCart = getGroupedCart();
  const totalSubtotal = groupedCart.reduce((sum, group) => sum + group.subtotal, 0);
  const deliveryFees = groupedCart.length * 99; // Rs.99 per restaurant
  const grandTotal = totalSubtotal + deliveryFees;

  const handlePlaceOrder = () => {
    if (cartCount === 0) return;

    setLoading(true);
    
    setTimeout(() => {
      toast.success("🎉 Order placed successfully! Your food is on the way.", {
        duration: 4000,
      });
      
      // Clear cart after successful order
      // In real app, you would call an API here
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 1500);
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items first!</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-semibold"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Delivery Address</h2>
          <div className="bg-orange-50 p-4 rounded-2xl">
            <p className="font-medium">{address}</p>
            <button className="text-orange-600 text-sm mt-2">Change address</button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          {groupedCart.map((group) => (
            <div key={group.restaurantId} className="mb-6 last:mb-0">
              <div className="font-medium mb-2">{group.restaurantName}</div>
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span>{item.quantity}× {item.name}</span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 text-sm flex justify-between font-medium">
                <span>Subtotal</span>
                <span>Rs. {group.subtotal}</span>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFees}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span>Rs. {grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 border border-orange-500 rounded-2xl bg-orange-50">
              <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when you receive</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-2xl opacity-60">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <p className="font-medium">Online Payment (Coming Soon)</p>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-3xl font-semibold text-lg transition flex items-center justify-center gap-2"
        >
          {loading ? "Placing Order..." : `Place Order - Rs. ${grandTotal}`}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your order will be delivered in {groupedCart[0]?.restaurantName || ''} estimated time
        </p>
      </div>
    </div>
  );
}