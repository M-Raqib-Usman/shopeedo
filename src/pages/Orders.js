import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch orders");
        toast.error("Could not load your orders");
        setOrders([
          { orderId: "ORD123456", address: "House 123, Jahanian", total: 2450, status: "delivered", createdAt: new Date() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div></div> {/* Spacer */}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600">When you place orders, they will appear here.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-2xl font-medium"
            >
              Browse Restaurants
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
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivered to</span>
                    <span className="font-medium text-right max-w-xs truncate">{order.address}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold">Rs. {order.total}</span>
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