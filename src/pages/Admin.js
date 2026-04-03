import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Admin Access Check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('shopeedo-user') || '{}');
    if (user.email !== 'admin@shopeedo.com') {
      toast.error("Access Denied! Admin only.");
      navigate('/');
    }
  }, [navigate]);

  // Fetch Orders & Restaurants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders
        const ordersRes = await fetch('http://localhost:5000/api/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }

        // Fetch Restaurants
        const restRes = await fetch('http://localhost:5000/api/restaurants');
        if (restRes.ok) {
          const restData = await restRes.json();
          setRestaurants(restData);
        }
      } catch (error) {
        console.error("Failed to fetch data");
        // Demo fallback data
        setOrders([
          { orderId: "ORD123456", address: "House 123, Jahanian", total: 2450, status: "pending", createdAt: new Date() },
          { orderId: "ORD123457", address: "Street 5, Khanewal", total: 1890, status: "confirmed", createdAt: new Date(Date.now() - 86400000) },
        ]);
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
        // Refresh orders
        const updatedOrders = orders.map(order => 
          order.orderId === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">A</div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Shopeedo Management Panel</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl transition"
          >
            Back to User Site
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex border-b mb-8 bg-white rounded-3xl p-1 w-fit">
          <button onClick={() => setActiveTab('dashboard')} className={`px-8 py-3 rounded-3xl font-medium ${activeTab === 'dashboard' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-3xl font-medium ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Orders</button>
          <button onClick={() => setActiveTab('restaurants')} className={`px-8 py-3 rounded-3xl font-medium ${activeTab === 'restaurants' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Restaurants</button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-5xl font-bold mt-4">{orders.length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <p className="text-gray-500">Pending Orders</p>
              <p className="text-5xl font-bold mt-4 text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-5xl font-bold mt-4">Rs. {orders.reduce((sum, o) => sum + (o.total || 0), 0)}</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Orders</h2>
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
                      <td className="py-6 px-6 text-sm text-gray-600">{order.address}</td>
                      <td className="py-6 px-6 font-semibold">Rs. {order.total}</td>
                      <td className="py-6 px-6">
                        <span className={`px-4 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
              <h2 className="text-2xl font-bold">Restaurant Management</h2>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-orange-600">
                + Add New Restaurant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{restaurant.cuisine}</p>
                  <div className="mt-4 flex justify-between text-sm">
                    <span>⭐ {restaurant.rating}</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 py-2 border border-gray-300 rounded-2xl text-sm hover:bg-gray-50">Edit</button>
                    <button className="flex-1 py-2 bg-red-500 text-white rounded-2xl text-sm hover:bg-red-600">Delete</button>
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