import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import { getUserOrders } from '../services/api';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('shopeedo-user');

    if (!savedUser) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const user = JSON.parse(savedUser);
    setIsLoggedIn(true);

    fetchUserOrders(user.email);

    // Polling for live updates
    const interval = setInterval(() => {
      fetchUserOrders(user.email, true); // true means silent update
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchUserOrders = async (email, silent = false) => {
    if (!silent) console.log("Fetching orders for:", email);
    try {
      const data = await getUserOrders(email);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      if (!silent) {
        console.error("Failed to fetch user orders", error);
        toast.error("Could not load your orders: " + error.message);
      }
      setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to view your personal order history.</p>

          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-semibold mb-4"
          >
            Login to Continue
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-orange-600 font-medium"
          >
            ← Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
            <p className="text-gray-600">When you place an order, it will appear here.</p>
            <p className="text-xs text-gray-400 mt-4">Searching for orders linked to: <span className="font-mono">{localStorage.getItem('shopeedo-user') ? JSON.parse(localStorage.getItem('shopeedo-user')).email : 'Not Logged In'}</span></p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 bg-orange-500 text-white px-10 py-4 rounded-2xl font-semibold"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-3xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono font-bold text-lg text-gray-900">{order.orderId}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'picked_up' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                    {order.status ? order.status.replace('_', ' ') : 'Processing'}
                  </span>
                </div>

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="my-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Live Tracking</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div className="bg-orange-500 h-2.5 rounded-full transition-all duration-500" style={{
                        width: order.status === 'pending' ? '25%' : 
                               order.status === 'ready' ? '50%' :
                               order.status === 'picked_up' ? '75%' : '100%'
                      }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span className={order.status === 'pending' ? 'text-orange-600' : ''}>Pending</span>
                      <span className={order.status === 'ready' ? 'text-orange-600' : ''}>Preparing</span>
                      <span className={order.status === 'picked_up' ? 'text-orange-600' : ''}>On the way</span>
                      <span>Delivered</span>
                    </div>

                    {(order.deliveryLocation || order.pickupLocation) && (
                      <div className="mt-4 border rounded-xl overflow-hidden shadow-sm">
                        <MapContainer 
                          location={order.riderLocation || order.deliveryLocation || order.pickupLocation}
                          height="220px"
                          showRouting={true}
                          markers={[
                            ...(order.pickupLocation ? [{ ...order.pickupLocation, popup: "Restaurant", type: 'restaurant' }] : []),
                            ...(order.deliveryLocation ? [{ ...order.deliveryLocation, popup: "Your Location", type: 'customer' }] : []),
                            ...(order.riderLocation ? [{ ...order.riderLocation, popup: "Rider", type: 'rider' }] : [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-2 mb-4 bg-gray-50 p-3 rounded-xl">
                  <MapPin className="text-orange-500 shrink-0" size={18} />
                  <p className="text-sm text-gray-700 leading-tight">{order.address}</p>
                </div>

                <div className="flex justify-between items-center text-sm pt-4 border-t">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-500 font-medium">Payment:</span>
                    <span className={`uppercase text-xs font-bold px-2 py-0.5 rounded ${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 block text-xs">Total</span>
                    <span className="font-bold text-lg">Rs. {order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}