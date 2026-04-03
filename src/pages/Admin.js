import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // Admin Check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('shopeedo-user') || '{}');
    if (user.email !== 'admin@shopeedo.com') {
      toast.error("Access Denied! Only Admin can access this page.");
      navigate('/');
    }
  }, [navigate]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const ordersRes = await fetch('http://localhost:5000/api/orders');
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(Array.isArray(data) ? data : []);
        }

        // Fetch Restaurants
        const restRes = await fetch('http://localhost:5000/api/restaurants');
        if (restRes.ok) {
          const data = await restRes.json();
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Fetch error");
        toast.error("Failed to load data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Order ${orderId} updated to ${newStatus}`);
        // Refresh list
        const updated = orders.map(o => o.orderId === orderId ? {...o, status: newStatus} : o);
        setOrders(updated);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">A</div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Shopeedo Control Center</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gray-800 text-white rounded-2xl hover:bg-gray-900">
            Back to User Site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 border-b pb-1">
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-3xl font-medium transition ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Orders</button>
          <button onClick={() => setActiveTab('restaurants')} className={`px-8 py-3 rounded-3xl font-medium transition ${activeTab === 'restaurants' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Restaurants</button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Orders ({orders.length})</h2>
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-5 px-6">Order ID</th>
                    <th className="text-left py-5 px-6">Address</th>
                    <th className="text-left py-5 px-6">Amount</th>
                    <th className="text-left py-5 px-6">Status</th>
                    <th className="text-left py-5 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="py-6 px-6 font-medium">{order.orderId}</td>
                      <td className="py-6 px-6 text-sm text-gray-600 max-w-xs truncate">{order.address}</td>
                      <td className="py-6 px-6 font-semibold">Rs. {order.total}</td>
                      <td className="py-6 px-6">
                        <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Restaurant Management ({restaurants.length})</h2>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-medium">
                + Add New Restaurant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((r) => (
                <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="font-semibold text-xl">{r.name}</h3>
                  <p className="text-gray-600">{r.cuisine}</p>
                  <div className="mt-4 flex gap-4">
                    <button className="flex-1 py-3 border border-gray-300 rounded-2xl text-sm hover:bg-gray-50">Edit Menu</button>
                    <button className="flex-1 py-3 bg-red-100 text-red-600 rounded-2xl text-sm hover:bg-red-200">Disable</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}