import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
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
        const restRes = await fetch('http://localhost:5000/api/admin/restaurants');
        if (restRes.ok) {
          const data = await restRes.json();
          setRestaurants(data);
        }

        // Fetch Pending Riders
        const ridersRes = await fetch('http://localhost:5000/api/admin/pending-riders');
        if (ridersRes.ok) {
          const data = await ridersRes.json();
          setPendingUsers(Array.isArray(data) ? data : []);
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

  const approveRestaurant = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/restaurants/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        toast.success(`Restaurant approved!`);
        const updated = restaurants.map(r => r.id === id ? {...r, isApproved: true} : r);
        setRestaurants(updated);
      }
    } catch (error) {
      toast.error("Failed to approve restaurant");
    }
  };

  const approveRider = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/riders/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        toast.success(`Rider approved!`);
        setPendingUsers(pendingUsers.filter(u => u._id !== id));
      }
    } catch (error) {
      toast.error("Failed to approve rider");
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
          <button onClick={() => setActiveTab('riders')} className={`px-8 py-3 rounded-3xl font-medium transition ${activeTab === 'riders' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            Pending Riders {pendingUsers.length > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs ml-2">{pendingUsers.length}</span>}
          </button>
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
                          <option value="picked_up">Picked Up</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
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
              <h2 className="text-2xl font-bold">Vendor Approvals ({restaurants.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((r) => (
                <div key={r.id} className={`bg-white rounded-3xl p-6 shadow-sm border ${r.isApproved ? 'border-transparent' : 'border-orange-200 bg-orange-50/30'}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border">
                      {r.logo ? <img src={r.logo} className="w-full h-full object-cover" alt="Logo" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Logo</div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-xl">{r.name}</h3>
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${r.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.isApproved ? 'APPROVED' : 'PENDING'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{r.cuisine}</p>
                      <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">📍 {r.address || 'Address not provided'}</p>
                      <p className="text-gray-500 text-xs mt-1">📧 {r.vendorEmail}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    {!r.isApproved && (
                      <button 
                        onClick={() => approveRestaurant(r.id)}
                        className="flex-1 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition shadow-md"
                      >
                        Approve Restaurant
                      </button>
                    )}
                    <button className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium hover:bg-gray-50">View Menu</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Riders Tab */}
        {activeTab === 'riders' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Rider Applications ({pendingUsers.length})</h2>
            
            {pendingUsers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-dashed border-gray-300">
                <p className="text-lg font-medium">Clear for now!</p>
                <p className="text-sm">No riders are currently waiting for approval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pendingUsers.map((user) => (
                  <div key={user._id} className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">{user.name}</h3>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                        {user.vehicleType || 'Rider'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">CNIC Number</p>
                        <p className="font-mono text-sm font-bold text-gray-800">{user.cnic || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">License Number</p>
                        <p className="font-mono text-sm font-bold text-gray-800">{user.licenseNumber || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <p className="text-sm font-bold text-gray-700">Document Photos</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border relative group">
                          {user.documents?.licensePhoto ? (
                            <img src={user.documents.licensePhoto} className="w-full h-full object-cover" alt="License" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No License Photo</div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                            <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 font-bold uppercase">License</span>
                          </div>
                        </div>
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border relative group">
                          {user.documents?.cnicPhoto ? (
                            <img src={user.documents.cnicPhoto} className="w-full h-full object-cover" alt="CNIC" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No CNIC Photo</div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                            <span className="text-[10px] text-white opacity-0 group-hover:opacity-100 font-bold uppercase">CNIC Front</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => approveRider(user._id)}
                        className="flex-1 py-4 bg-green-500 text-white rounded-2xl text-sm font-extrabold hover:bg-green-600 transition shadow-lg shadow-green-100"
                      >
                        Approve Application
                      </button>
                      <button className="flex-1 py-4 bg-white border border-gray-200 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-50 transition">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}