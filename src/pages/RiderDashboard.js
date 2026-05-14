import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Navigation, Package, CheckCircle, LogOut, User } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import { useNavigate } from 'react-router-dom';

const RiderDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'active'
  const [previewOrderId, setPreviewOrderId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('shopeedo-user'));
  const riderEmail = user?.email;

  useEffect(() => {
    if (riderEmail) {
      fetchOrders();
    }
  }, [riderEmail]);

  // Live Location Tracking for Rider
  useEffect(() => {
    if (!riderEmail) return;

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          
          // Update rider's general location
          axios.patch(`http://localhost:5000/api/users/${riderEmail}/location`, { location })
            .catch(err => console.error("General location update failed", err));

          // If there's an active order, update its riderLocation
          const activeOrder = myOrders.find(o => o.status === 'picked_up');
          if (activeOrder) {
            axios.patch(`http://localhost:5000/api/orders/${activeOrder.orderId}/rider-location`, { location })
              .catch(err => console.error("Order location update failed", err));
          }
        },
        (error) => console.error("Geolocation error:", error),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [riderEmail, myOrders]);

  // Helper to calculate distance in KM
  const calculateDistance = (loc1, loc2) => {
    if (!loc1 || !loc2 || !loc1.lat || !loc2.lat) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return (R * c).toFixed(1);
  };

  const fetchOrders = async () => {
    try {
      const [availableRes, myRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/available'),
        axios.get(`http://localhost:5000/api/orders/rider/${riderEmail}`)
      ]);
      setAvailableOrders(availableRes.data);
      setMyOrders(myRes.data.filter(o => o.status !== 'delivered')); // only active ones
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/accept`, { riderEmail });
      toast.success('Order accepted!');
      fetchOrders();
      setActiveTab('active');
    } catch (error) {
      toast.error('Could not accept order');
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/deliver`, { riderEmail });
      toast.success('Order marked as delivered!');
      fetchOrders();
    } catch (error) {
      toast.error('Could not update order status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shopeedo-user');
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  if (!user || user.role !== 'rider') {
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p>You must be logged in as a rider to view this page.</p>
        <button onClick={() => navigate('/auth')} className="mt-4 text-orange-500 hover:underline">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 pb-6 border-b">
        <h1 className="text-3xl font-bold text-gray-900">Rider Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium hidden md:block">
            {user.name}
          </div>
          <button 
            onClick={() => navigate('/rider/profile')}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-full font-medium transition"
          >
            <User size={18} /> Edit Profile
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2.5 rounded-full font-medium transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-4">
        <button
          onClick={() => setActiveTab('available')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            activeTab === 'available' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Package size={20} />
          Available Orders ({availableOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
            activeTab === 'active' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Navigation size={20} />
          My Active Orders ({myOrders.length})
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'available' && (
          availableOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No available orders right now.</p>
            </div>
          ) : (
            availableOrders
              .sort((a, b) => {
                if (!currentLocation) return 0;
                const distA = calculateDistance(currentLocation, a.pickupLocation) || 999;
                const distB = calculateDistance(currentLocation, b.pickupLocation) || 999;
                return distA - distB;
              })
              .map(order => (
              <div key={order._id}>
                <div 
                  onClick={() => setPreviewOrderId(previewOrderId === order.orderId ? null : order.orderId)}
                  className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row justify-between gap-6 cursor-pointer hover:border-blue-300 transition-all"
                >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      {order.orderId}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 mt-4">
                    <MapPin className="text-orange-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Address</p>
                      <p className="text-gray-600 text-sm mt-1">{order.address}</p>
                      {currentLocation && order.pickupLocation && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                          <Navigation size={12} />
                          {calculateDistance(currentLocation, order.pickupLocation)} km from your current spot
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>- {item.quantity}x {item.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">Rs. {order.total}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{order.paymentMethod}</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewOrderId(previewOrderId === order.orderId ? null : order.orderId);
                      }}
                      className="w-full bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                    >
                      {previewOrderId === order.orderId ? "Hide Map" : "View on Map"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptOrder(order.orderId);
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              </div>
              
              {previewOrderId === order.orderId && (
                <div className="mt-2 mb-6 bg-white p-4 rounded-2xl shadow-sm border animate-fade-in">
                  <MapContainer 
                    location={order.pickupLocation || order.deliveryLocation} 
                    height="250px" 
                    markers={[
                      ...(order.pickupLocation ? [{ ...order.pickupLocation, popup: 'Pickup: Restaurant', type: 'restaurant' }] : []),
                      ...(order.deliveryLocation ? [{ ...order.deliveryLocation, popup: 'Drop-off: Customer', type: 'customer' }] : [])
                    ]}
                  />
                </div>
              )}
            </div>
          ))
        )
      )}

        {activeTab === 'active' && (
          myOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm">
              <Navigation size={48} className="mx-auto mb-4 text-gray-300" />
              <p>You have no active orders.</p>
            </div>
          ) : (
            myOrders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                      {order.status.replace('_', ' ')}
                    </span>
                    <span className="font-medium text-gray-700">{order.orderId}</span>
                  </div>
                  <p className="font-bold text-xl">Rs. {order.total}</p>
                </div>
                
                {/* Map Integration with Navigation Guides */}
                {(order.deliveryLocation || order.pickupLocation) && (
                  <div className="mt-4 mb-6 border rounded-xl overflow-hidden relative">
                    <MapContainer 
                      location={order.riderLocation?.lat ? order.riderLocation : (order.pickupLocation?.lat ? order.pickupLocation : order.deliveryLocation)} 
                      height="300px" 
                      showRouting={true}
                      interactive={true}
                      markers={[
                        ...(order.pickupLocation ? [{ ...order.pickupLocation, popup: 'Pickup: Restaurant', type: 'restaurant' }] : []),
                        ...(order.deliveryLocation ? [{ ...order.deliveryLocation, popup: 'Drop-off: Customer', type: 'customer' }] : []),
                        ...(order.riderLocation ? [{ ...order.riderLocation, popup: 'You (Rider)', type: 'rider' }] : [])
                      ]}
                    />
                    
                    {/* Floating Navigation Button */}
                    <div className="absolute top-4 right-4 z-[1000]">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${order.status === 'picked_up' ? order.deliveryLocation.lat + ',' + order.deliveryLocation.lng : order.pickupLocation.lat + ',' + order.pickupLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg border text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                      >
                        <Navigation size={16} className="text-blue-600" />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 mt-4 mb-6">
                  <MapPin className="text-orange-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Deliver To:</p>
                    <p className="text-gray-600">{order.address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => markDelivered(order.orderId)}
                    className="flex-1 flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold transition-colors"
                  >
                    <CheckCircle size={20} />
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
