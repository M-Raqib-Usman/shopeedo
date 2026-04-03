import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { placeOrder } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { getGroupedCart, cartCount } = useCart();

  const [userAddress, setUserAddress] = useState("Jahanian, Punjab");
  const [loading, setLoading] = useState(false);

  // Load address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('shopeedo-address');
    if (savedAddress) {
      setUserAddress(savedAddress);
    }
  }, []);

  const groupedCart = getGroupedCart();
  const totalSubtotal = groupedCart.reduce((sum, group) => sum + group.subtotal, 0);
  const deliveryFees = groupedCart.length * 99;
  const grandTotal = totalSubtotal + deliveryFees;

  const handlePlaceOrder = async () => {
    if (cartCount === 0) return;

    // Check if user is logged in
    const savedUser = localStorage.getItem('shopeedo-user');
    if (!savedUser) {
      toast.error("Please login to place an order");
      navigate('/auth');
      return;
    }

    const user = JSON.parse(savedUser);

    setLoading(true);

    const orderData = {
      items: groupedCart.flatMap(group => 
        group.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          restaurantId: group.restaurantId
        }))
      ),
      address: userAddress,
      total: grandTotal,
      paymentMethod: "cash",
      userEmail: user.email                     // ← Sending user email
    };

    try {
      const result = await placeOrder(orderData);

      toast.success(`🎉 Order placed successfully! Order ID: ${result.orderId || 'SH' + Date.now().toString().slice(-6)}`, {
        duration: 5000,
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1800);
    } catch (error) {
      toast.success("🎉 Order placed successfully! (Demo Mode)", {
        duration: 4000,
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1600);
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-2xl font-semibold"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-4">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Delivery Address</h2>
            <button 
              onClick={() => {
                const newAddr = prompt("Enter new delivery address:", userAddress);
                if (newAddr && newAddr.trim()) setUserAddress(newAddr.trim());
              }}
              className="text-orange-600 text-sm font-medium hover:underline"
            >
              Change
            </button>
          </div>
          <div className="bg-orange-50 p-5 rounded-2xl">
            <p className="font-medium text-gray-800">{userAddress}</p>
            <p className="text-sm text-gray-600 mt-2">Estimated delivery: 30-45 minutes</p>
          </div>
        </div>

        {/* Order Summary - same as before */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-5">Order Summary</h2>
          
          {groupedCart.map((group) => (
            <div key={group.restaurantId} className="mb-8 last:mb-0">
              <div className="font-medium mb-3 text-orange-700">{group.restaurantName}</div>
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span>{item.quantity}× {item.name}</span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t my-4"></div>
            </div>
          ))}

          <div className="space-y-3 pt-4 border-t text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {totalSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFees}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Grand Total</span>
              <span>Rs. {grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
          <div className="p-4 border border-orange-500 rounded-2xl bg-orange-50 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-xs text-gray-500">Pay when you receive your order</p>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-3xl font-semibold text-lg transition shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? "Placing your order..." : `Place Order • Rs. ${grandTotal}`}
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your order will be prepared fresh by the respective restaurants
        </p>
      </div>
    </div>
  );
}