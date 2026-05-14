import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Store, Package, CheckCircle, Clock, LogOut, Camera, Upload, X, Printer, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SmartImage from '../components/SmartImage';

const VendorDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const navigate = useNavigate();

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('shopeedo-user'));
  const vendorEmail = user?.email;

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/vendor/${vendorEmail}`);
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [vendorEmail]);

  // Fetch menu items for vendor
  const fetchMenu = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/menu/vendor/${vendorEmail}`);
      setMenuItems(res.data);
    } catch (error) {
      toast.error('Failed to fetch menu');
    } finally {
      setMenuLoading(false);
    }
  }, [vendorEmail]);

  // Fetch orders and menu on component mount
  useEffect(() => {
    if (vendorEmail) {
      fetchOrders();
      fetchMenu();
    }
  }, [vendorEmail, fetchOrders, fetchMenu]);

  const addMenuItem = async () => {
    if (!newItemName || !newItemPrice || !newItemCategory) {
      toast.error('Name, price, and category are required');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/menu/vendor/${vendorEmail}`, {
        name: newItemName,
        price: parseFloat(newItemPrice),
        category: newItemCategory,
        image: newItemImage
      });
      toast.success('Menu item added');
      setNewItemName('');
      setNewItemPrice('');
      setNewItemCategory('');
      setNewItemImage('');
      fetchMenu();
    } catch (error) {
      toast.error('Failed to add menu item');
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${itemId}`);
      toast.success('Menu item removed');
      fetchMenu();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/vendor-status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      
      if (newStatus === 'confirmed') {
        const order = orders.find(o => o.orderId === orderId);
        setSelectedOrderForBill(order);
        setShowBillModal(true);
      }
      
      fetchOrders();
    } catch (error) {
      toast.error('Could not update order status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shopeedo-user');
    toast.success("Logged out successfully");
    navigate('/vendor-login');
  };

  if (!user || user.role !== 'vendor') {
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You must be logged in as a vendor to view this page.</p>
        <button onClick={() => navigate('/auth')} className="mt-4 text-orange-500 hover:underline">Go to Login</button>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'ready' && o.status !== 'picked_up');
  const pastOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled' || o.status === 'ready' || o.status === 'picked_up');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500">
            <Store size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}'s Dashboard</h1>
            <p className="text-gray-500">Manage your restaurant orders and menu</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium hidden md:block">
            {user.name}
          </div>
          <button 
            onClick={() => navigate('/vendor/profile')}
            className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-5 py-2.5 rounded-full font-medium transition shadow-lg shadow-orange-100"
          >
            <Store size={18} /> Manage Shop
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2.5 rounded-full font-medium transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 ${
            activeTab === 'orders' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-4 px-2 font-medium text-lg transition-colors border-b-2 ${
            activeTab === 'menu' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Menu Management
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="grid md:grid-cols-2 gap-8">
        {/* Active Orders Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" /> Action Required ({activeOrders.length})
          </h2>
          
          {loading ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : activeOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm text-center border">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No new orders waiting for action.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {order.status}
                      </span>
                      <p className="font-mono font-bold mt-2">{order.orderId}</p>
                    </div>
                    <p className="text-xl font-bold">Rs. {order.total}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(order.orderId, 'confirmed')}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors"
                      >
                        Accept & Confirm
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => updateStatus(order.orderId, 'preparing')}
                            className="flex-[2] bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors"
                          >
                            Start Preparing
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrderForBill(order);
                              setShowBillModal(true);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Printer size={18} /> Bill
                          </button>
                        </div>
                    )}
                    {order.status === 'preparing' && (
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => updateStatus(order.orderId, 'ready')}
                            className="flex-[2] bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle size={18} /> Mark Ready
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrderForBill(order);
                              setShowBillModal(true);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Printer size={18} /> Bill
                          </button>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Past & Ready Orders ({pastOrders.length})</h2>
          
          {pastOrders.length === 0 ? (
             <p className="text-gray-500">No past orders.</p>
          ) : (
            <div className="space-y-4 opacity-75">
              {pastOrders.slice(0, 10).map(order => ( // Only show last 10
                <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center">
                  <div>
                    <p className="font-mono font-bold text-sm">{order.orderId}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'ready' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'picked_up' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                    <p className="font-bold text-sm mt-1">Rs. {order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {activeTab === 'menu' && (
        <div className="mt-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="text-green-500" /> Menu Management
          </h2>
          {menuLoading ? (
            <p className="text-gray-500">Loading menu...</p>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {menuItems.map(item => (
                  <motion.div 
                    key={item._id} 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {item.image ? (
                        <SmartImage 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110" 
                          fallbackText={item.name}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-orange-50">
                          <Package size={40} className="text-orange-300 mb-2" />
                          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl">{item.name}</h3>
                      <p className="text-orange-600 font-black mt-1 mb-5 text-lg">Rs. {item.price}</p>
                      <button 
                        onClick={() => deleteMenuItem(item._id)} 
                        className="mt-auto bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-sm"
                      >
                        Delete Item
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Item</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="E.g., Chicken Biryani"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                    <input
                      type="number"
                      placeholder="E.g., 250"
                      value={newItemPrice}
                      onChange={e => setNewItemPrice(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newItemCategory}
                      onChange={e => setNewItemCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">Select a category</option>
                      <option value="Pizza">🍕 Pizza</option>
                      <option value="Biryani">🍲 Biryani</option>
                      <option value="Burgers">🍔 Burgers</option>
                      <option value="Fast Food">🍟 Fast Food</option>
                      <option value="Chinese">🥡 Chinese</option>
                      <option value="Desserts">🍰 Desserts</option>
                      <option value="Drinks">🥤 Drinks</option>
                      <option value="BBQ">🍖 BBQ</option>
                      <option value="Karahi">🍛 Karahi</option>
                      <option value="Paratha">🫓 Paratha</option>
                      <option value="Shawarma">🌯 Shawarma</option>
                      <option value="Pasta">🍝 Pasta</option>
                      <option value="Seafood">🦐 Seafood</option>
                      <option value="Sandwich">🥪 Sandwich</option>
                      <option value="Main Course">🍽️ Main Course</option>
                      <option value="Appetizers">🥗 Appetizers</option>
                      <option value="Sides">🥙 Sides</option>
                      <option value="Ice Cream">🍦 Ice Cream</option>
                      <option value="Chicken">🍗 Chicken</option>
                      <option value="Rolls">🌯 Rolls</option>
                      <option value="Groceries">🛒 Groceries</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Photo (Device/Camera)</label>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden flex-shrink-0 ${newItemImage ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                        {newItemImage ? <img src={newItemImage} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={20} className="text-gray-400" />}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewItemImage(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-500 text-sm flex items-center gap-2">
                          <Upload size={16} /> {newItemImage ? 'Change Photo' : 'Select or Take Photo'}
                        </div>
                      </div>
                      {newItemImage && (
                        <button onClick={() => setNewItemImage('')} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={addMenuItem} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
                >
                  Add to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bill Slip Modal */}
      <AnimatePresence>
        {showBillModal && selectedOrderForBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBillModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package className="text-orange-500" />
                  <h3 className="text-xl font-bold">Order Bill Slip</h3>
                </div>
                <button onClick={() => setShowBillModal(false)} className="hover:bg-white/10 p-2 rounded-full transition">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Header info */}
                <div className="text-center border-b border-dashed pb-6">
                  <h2 className="text-3xl font-black text-gray-900 mb-1">SHOPEEDO</h2>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{user.name}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(selectedOrderForBill.createdAt).toLocaleString()}</p>
                </div>

                {/* Customer Details */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Customer Information</p>
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-1 text-gray-400" />
                    <div>
                      <p className="font-bold text-gray-800">{selectedOrderForBill.userEmail}</p>
                      <p className="text-sm text-gray-500 leading-tight">{selectedOrderForBill.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Ordered Items</p>
                  <div className="space-y-3">
                    {selectedOrderForBill.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-lg font-black text-gray-600">
                            {item.quantity}
                          </span>
                          <span className="font-bold text-gray-800">{item.name}</span>
                        </div>
                        <span className="font-black text-gray-900">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t-2 border-dashed pt-4 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900">Total Amount</span>
                  <span className="text-3xl font-black text-orange-500 tracking-tighter">Rs. {selectedOrderForBill.total}</span>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <div className="bg-gray-50 py-3 rounded-2xl">
                    <p className="text-xs font-bold text-gray-500">Payment Method: <span className="text-gray-900 uppercase">{selectedOrderForBill.paymentMethod}</span></p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold">Thank you for choosing Shopeedo!</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
                >
                  <Printer size={20} /> PRINT BILL
                </button>
                <button 
                  onClick={() => setShowBillModal(false)}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all active:scale-95"
                >
                  DISMISS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboard;
