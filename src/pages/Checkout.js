import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { placeOrder } from '../services/api';
import MapContainer from '../components/MapContainer';
import axios from 'axios';
import { Navigation } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { getGroupedCart, cartCount } = useCart();

  const [userAddress, setUserAddress] = useState("Sahiwal, Punjab");
  const [deliveryLocation, setDeliveryLocation] = useState({ lat: 30.6682, lng: 73.1114 });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [cardDetails, setCardDetails] = useState('');
  const [paymentStatus] = useState('pending');

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

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const toastId = toast.loading("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLocation({ lat: latitude, lng: longitude });
        
        try {
          // Reverse geocoding to get address text (Optional but nice)
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data && res.data.display_name) {
            setUserAddress(res.data.display_name);
          }
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        }
        
        toast.success("Location detected!", { id: toastId });
      },
      (error) => {
        toast.error("Could not get your location. Please check permissions.", { id: toastId });
        console.error(error);
      }
    );
  };

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
      deliveryLocation,
      total: grandTotal,
      paymentMethod,
      paymentStatus,
      userEmail: user.email                     // ← Sending user email
    };

    try {
      if (paymentMethod === 'card') {
        const paymentRes = await axios.post('http://localhost:5000/api/payment/process', {
          cardNumber: cardDetails,
          amount: grandTotal
        });
        if (!paymentRes.data.success) {
          toast.error(paymentRes.data.message);
          setLoading(false);
          return;
        }
        orderData.paymentStatus = 'completed';
      }

      const result = await placeOrder(orderData);

      toast.success(`🎉 Order placed successfully! Order ID: ${result.orderId || 'SH' + Date.now().toString().slice(-6)}`, {
        duration: 5000,
      });

      setTimeout(() => {
        window.location.href = '/orders'; // Redirect to orders page to see tracking
      }, 1800);
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
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

        {/* Delivery Address & Map */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Delivery Location</h2>
            <button 
              onClick={() => {
                const newAddr = prompt("Enter new delivery address:", userAddress);
                if (newAddr && newAddr.trim()) setUserAddress(newAddr.trim());
              }}
              className="text-orange-600 text-sm font-medium hover:underline"
            >
              Change Address Text
            </button>
          </div>
          <div className="bg-orange-50 p-5 rounded-2xl mb-4">
            <p className="font-medium text-gray-800">{userAddress}</p>
            <p className="text-sm text-gray-600 mt-2">Estimated delivery: 30-45 minutes</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">Adjust your exact location on the map:</p>
              <button 
                onClick={detectLocation}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
              >
                <Navigation size={12} fill="currentColor" /> Detect My Location
              </button>
            </div>
            <MapContainer 
              location={deliveryLocation} 
              setLocation={setDeliveryLocation} 
              interactive={true} 
            />
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
          
          <div className="space-y-4">
            {/* Cash Option */}
            <div 
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 border rounded-2xl cursor-pointer flex items-center gap-3 transition-colors ${
                paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash' ? 'border-orange-500' : 'border-gray-300'
              }`}>
                {paymentMethod === 'cash' && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
              </div>
              <div>
                <p className="font-medium flex items-center gap-2">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when you receive your order</p>
              </div>
            </div>

            {/* Card Option */}
            <div 
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-2xl cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Mock payment processing</p>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 ml-8 animate-fade-in">
                  <input 
                    type="text" 
                    placeholder="Card Number (16 digits)" 
                    className="w-full p-3 border rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={cardDetails}
                    onChange={(e) => setCardDetails(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <input type="text" placeholder="CVC" className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              )}
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