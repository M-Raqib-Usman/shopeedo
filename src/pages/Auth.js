// src/pages/Auth.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
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
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
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
            password: formData.password
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
            if (loginResult.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
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
          <div className="mx-auto w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white text-5xl mb-5 shadow-lg">
            S
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Shopeedo</h1>
          <p className="text-gray-600 mt-2">Fast delivery for Food & Groceries</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl p-1 shadow-sm mb-8 flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-4 rounded-3xl font-semibold transition-all ${
              isLogin ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-4 rounded-3xl font-semibold transition-all ${
              !isLogin ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
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
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
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
                className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white py-4 rounded-2xl font-semibold text-lg transition mt-6"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}