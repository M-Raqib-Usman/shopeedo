import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  }, []);

  const fetchUserOrders = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/user/${email}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch user orders");
      toast.error("Could not load your orders");
      setOrders([]);
    } finally {
      setLoading(false);
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
                    <p className="font-mono font-medium text-lg">{order.orderId}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-1 text-xs font-medium rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{order.address}</p>

                <div className="flex justify-between text-sm pt-4 border-t">
                  <span className="text-gray-600">Total Paid</span>
                  <span className="font-semibold">Rs. {order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}