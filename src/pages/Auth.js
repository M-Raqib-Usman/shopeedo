// src/pages/Auth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer', 'vendor', 'rider', 'admin'

  const roleConfig = {
    customer: {
      color: 'orange',
      bgClass: 'bg-orange-500',
      hoverClass: 'hover:bg-orange-600',
      textClass: 'text-orange-500',
      ringClass: 'focus:ring-orange-400',
      icon: 'S',
      title: 'Shopeedo',
      subtitle: 'Fast delivery for Food & Groceries'
    },
    rider: {
      color: 'blue',
      bgClass: 'bg-blue-600',
      hoverClass: 'hover:bg-blue-700',
      textClass: 'text-blue-600',
      ringClass: 'focus:ring-blue-500',
      icon: 'R',
      title: 'Rider App',
      subtitle: 'Deliver smiles, earn money'
    },
    vendor: {
      color: 'emerald',
      bgClass: 'bg-emerald-600',
      hoverClass: 'hover:bg-emerald-700',
      textClass: 'text-emerald-600',
      ringClass: 'focus:ring-emerald-500',
      icon: 'V',
      title: 'Vendor Portal',
      subtitle: 'Manage your restaurant & grow'
    },
    admin: {
      color: 'gray',
      bgClass: 'bg-gray-900',
      hoverClass: 'hover:bg-black',
      textClass: 'text-gray-900',
      ringClass: 'focus:ring-gray-700',
      icon: 'A',
      title: 'Admin Control',
      subtitle: 'Platform management center'
    }
  };

  const currentConfig = roleConfig[selectedRole];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    cnic: '',
    vehicleType: 'bike',
    restaurantName: '',
    businessAddress: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('shopeedo-user', JSON.stringify(result.user));
          toast.success("🎉 Login successful!");

          // Redirect based on role
          if (result.user.role === 'admin') navigate('/admin');
          else if (result.user.role === 'vendor') navigate('/vendor');
          else if (result.user.role === 'rider') navigate('/rider');
          else navigate('/');
        } else {
          toast.error(result.message || "Invalid email or password");
        }
      } else {
        // SIGNUP
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: selectedRole,
            licenseNumber: formData.licenseNumber,
            cnic: formData.cnic,
            vehicleType: formData.vehicleType,
            restaurantName: formData.restaurantName,
            address: formData.businessAddress
          })
        });

        const result = await response.json();

        if (result.success) {
          toast.success("🎉 Account created successfully! Logging you in...");

          // Auto login after successful signup
          const loginResponse = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          });

          const loginResult = await loginResponse.json();

          if (loginResult.success) {
            localStorage.setItem('shopeedo-user', JSON.stringify(loginResult.user));
            
            // Redirect based on role
            if (loginResult.user.role === 'admin') navigate('/admin');
            else if (loginResult.user.role === 'vendor') navigate('/vendor');
            else if (loginResult.user.role === 'rider') navigate('/rider');
            else navigate('/');
          } else {
            // Rider accounts are pending - show a message and redirect to login
            toast("⏳ Your account is pending admin approval. You'll be notified once approved.", { duration: 5000 });
            setIsLogin(true);
          }
        } else {
          toast.error(result.message || "Failed to create account");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium z-10"
      >
        ← Back to Home
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className={`mx-auto w-20 h-20 ${currentConfig.bgClass} rounded-3xl flex items-center justify-center text-white text-5xl mb-5 shadow-lg transition-colors`}>
            {currentConfig.icon}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 transition-colors">
            {currentConfig.title}
          </h1>
          <p className="text-gray-600 mt-2 transition-colors">
            {currentConfig.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl p-1 shadow-sm mb-8 flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 rounded-3xl font-semibold transition-all ${
              isLogin ? `${currentConfig.bgClass} text-white shadow-sm` : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 rounded-3xl font-semibold transition-all ${
              !isLogin ? `${currentConfig.bgClass} text-white shadow-sm` : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                {selectedRole === 'rider' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                        placeholder="Driving License #"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CNIC Number</label>
                      <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                        placeholder="XXXXX-XXXXXXX-X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                      >
                        <option value="bike">Motorcycle</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="car">Car</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedRole === 'vendor' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Restaurant Name</label>
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                        placeholder="e.g. Pizza House"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Address</label>
                      <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                        placeholder="Full shop address"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 ${currentConfig.ringClass}`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${currentConfig.bgClass} ${currentConfig.hoverClass} disabled:opacity-70 text-white py-4 rounded-2xl font-semibold text-lg transition mt-6`}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={`${currentConfig.textClass} font-medium hover:underline`}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
          
          {selectedRole !== 'customer' && (
            <div className="mt-4 text-center border-t pt-4">
              <button
                type="button"
                onClick={() => { setSelectedRole('customer'); setIsLogin(true); }}
                className="text-gray-500 hover:text-gray-900 text-sm font-medium transition"
              >
                ← Back to Customer Login
              </button>
            </div>
          )}
        </div>

        {selectedRole === 'customer' && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <button 
              onClick={() => { setSelectedRole('vendor'); setIsLogin(true); }}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Become a Vendor
            </button>
            <button 
              onClick={() => { setSelectedRole('rider'); setIsLogin(true); }}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Become a Rider
            </button>
            <button 
              onClick={() => { setSelectedRole('admin'); setIsLogin(true); }}
              className="px-4 py-2 border border-gray-300 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-medium transition"
            >
              Admin Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}