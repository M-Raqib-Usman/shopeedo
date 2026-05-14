import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Upload, CheckCircle, Shield, Truck, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile } from '../services/api';

const RiderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    cnic: '',
    vehicleType: 'bike'
  });
  const [documents, setDocuments] = useState({
    licensePhoto: null,
    cnicPhoto: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('shopeedo-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role !== 'rider') {
        navigate('/');
        return;
      }
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        phone: parsedUser.phone || '',
        licenseNumber: parsedUser.licenseNumber || '',
        cnic: parsedUser.cnic || '',
        vehicleType: parsedUser.vehicleType || 'bike'
      });
      if (parsedUser.documents) {
        setDocuments(parsedUser.documents);
      }
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateProfile({
        email: user.email,
        ...formData,
        documents
      });

      if (result.success) {
        localStorage.setItem('shopeedo-user', JSON.stringify(result.user));
        setUser(result.user);
        setIsEditing(false);
        toast.success('Profile and documents updated!');
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Failed to connect to server');
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
            <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 relative overflow-hidden group">
              <User size={48} />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white cursor-pointer transition">
                <Camera size={20} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified Rider
                </span>
                {!user.isApproved && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    Pending Approval
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* General Info */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Shield size={22} className="text-blue-500" />
              Account Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Full Name</label>
                <input 
                  type="text"
                  readOnly={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent cursor-default'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Email (Unchangeable)</label>
                <div className="p-4 rounded-2xl bg-gray-100 border-transparent text-gray-500 flex items-center gap-2">
                  <Mail size={18} /> {user.email}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Phone Number</label>
                <input 
                  type="tel"
                  readOnly={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 ml-1">Vehicle Type</label>
                <select
                  disabled={!isEditing}
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                  className={`w-full p-4 rounded-2xl border transition ${isEditing ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent'}`}
                >
                  <option value="bike">Motorcycle</option>
                  <option value="bicycle">Bicycle</option>
                  <option value="car">Car</option>
                </select>
              </div>
            </div>
          </section>

          {/* Documents */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileText size={22} className="text-blue-500" />
              Verifiable Documents
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* License */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase ml-1 tracking-tight">Driving License</label>
                <input 
                  type="text"
                  readOnly={!isEditing}
                  placeholder="License #"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className={`w-full p-3 rounded-xl border transition ${isEditing ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-transparent'}`}
                />
                <div className={`relative aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${documents.licensePhoto ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  {documents.licensePhoto ? (
                    <>
                      <img src={documents.licensePhoto} className="w-full h-full object-cover" alt="License" />
                      {isEditing && (
                        <button 
                          onClick={() => setDocuments({...documents, licensePhoto: null})}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-xs text-gray-500 font-medium mb-4">Click to upload license photo</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, 'licensePhoto')}
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CNIC */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase ml-1 tracking-tight">CNIC (ID Card)</label>
                <input 
                  type="text"
                  readOnly={!isEditing}
                  placeholder="CNIC #"
                  value={formData.cnic}
                  onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                  className={`w-full p-3 rounded-xl border transition ${isEditing ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-transparent'}`}
                />
                <div className={`relative aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${documents.cnicPhoto ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  {documents.cnicPhoto ? (
                    <>
                      <img src={documents.cnicPhoto} className="w-full h-full object-cover" alt="CNIC" />
                      {isEditing && (
                        <button 
                          onClick={() => setDocuments({...documents, cnicPhoto: null})}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-xs text-gray-500 font-medium mb-4">Click to upload CNIC front photo</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFileUpload(e, 'cnicPhoto')}
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="flex justify-end pt-6 border-t">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Save Profile Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-gray-100 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Need help with registration?</p>
            <p className="text-xs text-gray-500">Contact our rider support team 24/7</p>
          </div>
        </div>
        <button className="text-blue-600 font-bold text-sm hover:underline">Support Center →</button>
      </div>
    </div>
  );
};

export default RiderProfile;
