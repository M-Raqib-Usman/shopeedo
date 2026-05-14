import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, LogOut, Package, Edit2, Save, X, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateProfile, getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ cardholderName: '', cardNumber: '', expiryDate: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('shopeedo-user');
    const savedAddress = localStorage.getItem('shopeedo-address');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        phone: parsedUser.phone || ''
      });
    } else {
      navigate('/auth');
    }
    
    if (savedAddress) {
      setAddress(savedAddress);
    } else {
      setAddress("Sahiwal, Punjab");
    }

    if (savedUser) {
      fetchPaymentMethods(JSON.parse(savedUser).email);
    }
  }, [navigate]);

  const fetchPaymentMethods = async (email) => {
    try {
      const methods = await getPaymentMethods(email);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.cardNumber || newCard.cardNumber.length < 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    setPaymentLoading(true);
    try {
      const result = await addPaymentMethod({
        userEmail: user.email,
        cardholderName: newCard.cardholderName,
        cardNumber: newCard.cardNumber,
        expiryDate: newCard.expiryDate,
        cardType: newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard'
      });
      if (result.success) {
        toast.success('Card added securely');
        setShowAddCard(false);
        setNewCard({ cardholderName: '', cardNumber: '', expiryDate: '' });
        fetchPaymentMethods(user.email);
      }
    } catch (error) {
      toast.error('Failed to add card');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Remove this card?')) return;
    try {
      const result = await deletePaymentMethod(id);
      if (result.success) {
        toast.success('Card removed');
        fetchPaymentMethods(user.email);
      }
    } catch (error) {
      toast.error('Failed to remove card');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shopeedo-user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.trim() === '') {
      toast.error('Phone number is compulsory');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        email: user.email,
        name: formData.name,
        phone: formData.phone,
        address: address
      });

      if (result.success) {
        localStorage.setItem('shopeedo-user', JSON.stringify(result.user));
        setUser(result.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 text-left">
      <div className="bg-white rounded-3xl shadow-sm border p-8 mb-8">
        <div className="flex items-center justify-between mb-8 border-b pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
              <User size={48} />
            </div>
            <div>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="text-2xl font-bold text-gray-900 border-b border-orange-300 focus:outline-none bg-orange-50 px-2 rounded"
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              )}
              <p className="text-gray-500 mt-1 capitalize flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : user.role === 'rider' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                {user.role} Account
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
          >
            {isEditing ? <X size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Email cannot be changed</p>
              </div>
            </div>

            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isEditing ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-transparent'}`}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                {isEditing ? (
                  <input 
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full font-semibold text-gray-900 bg-transparent focus:outline-none border-b border-orange-300"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Delivery Details</h2>
          
          <div className="p-4 border rounded-2xl bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">Saved Address</p>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>
            </div>
            {!isEditing && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={handleUpdateProfile}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>
        </form>

        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={24} className="text-gray-800" /> Payment Methods
          </div>
          {!showAddCard && (
            <button 
              onClick={() => setShowAddCard(true)}
              className="text-orange-600 bg-orange-50 hover:bg-orange-100 p-2 rounded-xl text-sm font-bold flex items-center gap-1 transition"
            >
              <Plus size={16} /> Add Card
            </button>
          )}
        </h2>

        {showAddCard && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Add New Card</h3>
              <button onClick={() => setShowAddCard(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                <input 
                  type="text" required
                  value={newCard.cardholderName} onChange={e => setNewCard({...newCard, cardholderName: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                <input 
                  type="text" required maxLength="16"
                  value={newCard.cardNumber} onChange={e => setNewCard({...newCard, cardNumber: e.target.value.replace(/\D/g, '')})}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</label>
                <input 
                  type="text" required maxLength="5"
                  value={newCard.expiryDate} onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                    setNewCard({...newCard, expiryDate: val});
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                  placeholder="MM/YY"
                />
              </div>
              <button type="submit" disabled={paymentLoading} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition">
                {paymentLoading ? 'Saving...' : 'Save Securely'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {paymentMethods.length === 0 && !showAddCard ? (
            <p className="text-gray-500 text-sm">No saved payment methods. Add a card to speed up your checkout.</p>
          ) : (
            paymentMethods.map(card => (
              <div key={card._id} className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-8 rounded bg-gradient-to-r ${card.cardType === 'Visa' ? 'from-blue-600 to-blue-800' : 'from-red-500 to-yellow-500'} flex items-center justify-center text-white font-bold italic text-xs shadow-sm`}>
                    {card.cardType}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-gray-900 tracking-widest">{card.cardNumberMasked}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Expires {card.expiryDate}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteCard(card._id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Package size={20} />
            View Order History
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium transition-colors ml-auto"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
