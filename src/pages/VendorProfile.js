import React, { useState, useEffect } from 'react';
import { Store, Mail, Phone, MapPin, Camera, Upload, Save, X, Globe, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../services/api';
import axios from 'axios';

const VendorProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    deliveryTime: '',
    deliveryFee: '',
    address: '',
    contactInfo: '',
    logo: '',
    image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const savedUser = localStorage.getItem('shopeedo-user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.role !== 'vendor') {
          navigate('/');
          return;
        }
        setUser(parsedUser);
        
        try {
          const res = await axios.get(`http://localhost:5000/api/admin/restaurants`);
          const myRest = res.data.find(r => r.vendorEmail === parsedUser.email);
          if (myRest) {
            setRestaurant(myRest);
            setFormData({
              name: myRest.name || '',
              cuisine: myRest.cuisine || '',
              deliveryTime: myRest.deliveryTime || '',
              deliveryFee: myRest.deliveryFee || '',
              address: myRest.address || '',
              contactInfo: myRest.contactInfo || '',
              logo: myRest.logo || '',
              image: myRest.image || ''
            });
          }
        } catch (err) {
          console.error("Failed to fetch restaurant info");
        }
      } else {
        navigate('/auth');
      }
    };
    fetchData();
  }, [navigate]);

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/restaurants/vendor/${user.email}`, formData);
      if (res.data.success) {
        setRestaurant(res.data.restaurant);
        setIsEditing(false);
        toast.success('Restaurant profile updated!');
      }
    } catch (error) {
      toast.error('Failed to update restaurant info');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">
        <div className="flex items-center justify-between mb-10 border-b pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 relative overflow-hidden group">
              {formData.logo ? (
                <img src={formData.logo} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <Store size={48} />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer transition">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formData.name || 'Your Restaurant'}</h1>
              <div className="flex items-center gap-2 mt-2">
                {restaurant?.isApproved ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Approved</span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Pending Approval</span>
                )}
                <span className="text-sm text-gray-500 font-medium ml-2">{user.email}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
          >
            {isEditing ? 'Cancel' : 'Manage Restaurant'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe size={22} className="text-orange-500" />
              Business Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Restaurant Name</label>
                <input 
                  type="text"
                  readOnly={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Cuisine Specialty</label>
                <input 
                  type="text"
                  readOnly={!isEditing}
                  placeholder="e.g. Italian, Pakistani"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({...formData, cuisine: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Contact Phone</label>
                <input 
                  type="tel"
                  readOnly={!isEditing}
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Business Address</label>
                <div className="relative">
                  <input 
                    type="text"
                    readOnly={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`w-full p-4 pl-12 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                  />
                  <MapPin size={18} className="absolute left-4 top-4.5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock size={22} className="text-orange-500" />
              Operational Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Estimated Delivery Time</label>
                <div className="relative">
                  <input 
                    type="text"
                    readOnly={!isEditing}
                    placeholder="e.g. 20-30 min"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                    className={`w-full p-4 pl-12 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                  />
                  <Clock size={18} className="absolute left-4 top-4.5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Delivery Fee (Rs.)</label>
                <div className="relative">
                  <input 
                    type="number"
                    readOnly={!isEditing}
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
                    className={`w-full p-4 pl-12 rounded-2xl border transition ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}
                  />
                  <DollarSign size={18} className="absolute left-4 top-4.5 text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Camera size={22} className="text-orange-500" />
              Banner Image
            </h2>
            <div className={`relative aspect-[21/9] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${formData.image ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
              {formData.image ? (
                <>
                  <img src={formData.image} className="w-full h-full object-cover" alt="Banner" />
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, image: ''})}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <Upload className="mx-auto mb-3 text-gray-400" size={40} />
                  <p className="text-sm text-gray-500 font-bold mb-4">Upload Restaurant Header Photo</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-400">Recommended size: 1200x500px</p>
                </div>
              )}
            </div>
          </section>

          {isEditing && (
            <div className="flex justify-end pt-6 border-t">
              <button 
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Restaurant Profile'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;
