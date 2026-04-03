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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userData = {
        name: isLogin 
          ? (formData.email.split('@')[0] || "User") 
          : (formData.name || formData.email.split('@')[0] || "User"),
        email: formData.email,
        phone: formData.phone || '',
        role: formData.email === "admin@shopeedo.com" ? "admin" : "customer"
      };

      // Save user to localStorage
      localStorage.setItem('shopeedo-user', JSON.stringify(userData));

      toast.success(isLogin ? "🎉 Login successful!" : "🎉 Account created successfully!");

      // Redirect logic
      if (userData.role === "admin") {
        toast.success("Welcome Admin! Redirecting to Dashboard...", { duration: 2000 });
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        navigate('/');
      }

      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white text-5xl mb-5 shadow-lg">
            S
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Shopeedo</h1>
          <p className="text-gray-600 mt-2">Fast delivery for Food & Groceries</p>
        </div>

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your full name"
                />
              </div>
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

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-xs text-gray-600">
            <p className="font-medium mb-1">Demo Login:</p>
            <p>Email: <span className="font-mono">admin@shopeedo.com</span></p>
            <p>Password: anything</p>
          </div>
        </div>
      </div>
    </div>
  );
}