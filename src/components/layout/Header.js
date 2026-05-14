import { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingCart, ChevronDown, LogIn, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Header() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState("Sahiwal, Punjab");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Load user and address data
  useEffect(() => {
    const savedAddress = localStorage.getItem('shopeedo-address');
    if (savedAddress) setUserAddress(savedAddress);

    const savedUser = localStorage.getItem('shopeedo-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserName(user.name || "User");
    }
  }, []);

  // Save address
  useEffect(() => {
    localStorage.setItem('shopeedo-address', userAddress);
  }, [userAddress]);

  const handleLogout = () => {
    localStorage.removeItem('shopeedo-user');
    setIsLoggedIn(false);
    setUserName("");

    toast.success("Logged out successfully");
    navigate('/auth');
  };


  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    toast.loading("Detecting your location...", { id: "location" });

    navigator.geolocation.getCurrentPosition(
      () => {
        setUserAddress("Near You • Sahiwal, Punjab");
        toast.success("✅ Location detected successfully!", { id: "location", duration: 2000 });
        setIsLocationOpen(false);
      },
      () => {
        toast.dismiss("location");
        toast.error("Unable to detect location. Please enter manually.");
      }
    );
  };



  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 shadow-lg shadow-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row */}
        <div className="h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-orange-500/20">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl tracking-tighter">Shopeedo</span>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest -mt-1">Sahiwal's Best</p>
            </div>
          </div>

          {/* Location Picker */}
          <div 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 cursor-pointer transition-all bg-gray-50/50 hover:bg-orange-50 px-4 py-1.5 rounded-full border border-gray-100"
          >
            <MapPin size={18} className="text-orange-500" />
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Deliver to</span>
              <div className="font-bold text-gray-800 text-sm leading-tight truncate max-w-[200px]">
                {userAddress}
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            <NavLink to="/cart" className="relative text-gray-700 hover:text-orange-600 transition-transform hover:scale-110 active:scale-95">
              <ShoppingCart size={23} strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black min-w-[18px] h-4.5 rounded-full flex items-center justify-center px-1 shadow-lg shadow-orange-500/30">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Auth / Profile Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 relative group">
                <div 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-white px-3 py-1.5 rounded-2xl border border-gray-100 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-black text-white text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-bold text-gray-800">{userName}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 cursor-pointer bg-orange-500 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 active:scale-95"
              >
                <LogIn size={20} />
                <span className="hidden md:block text-sm">Login</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="h-12 flex items-center border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex-1 max-w-2xl mx-auto relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search biryani, pizza, groceries..."
              onChange={(e) => {
                const query = e.target.value;
                if (query.length > 2) {
                  navigate(`/?search=${encodeURIComponent(query)}`);
                } else if (query.length === 0) {
                  navigate(`/`);
                }
              }}
              className="w-full pl-12 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all focus:bg-white focus:shadow-inner"
            />
          </div>

          <nav className="flex gap-7 text-sm font-medium ml-auto">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Home</NavLink>
            <NavLink to="/restaurants" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Restaurants</NavLink>
            <NavLink to="/categories" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Categories</NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Orders</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Profile</NavLink>
            <NavLink to="/help" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Help</NavLink>
          </nav>
        </div>
      </div>
      
      {/* Location Modal - Keep your existing modal code here */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-[90%] max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Set delivery location</h3>
            <p className="text-sm text-gray-600 mb-4">{userAddress}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLocationOpen(false)}
                className="px-3 py-1 rounded-md border border-gray-200 text-sm"
              >
                Close
              </button>
              <button
                onClick={getCurrentLocation}
                className="px-3 py-1 rounded-md bg-orange-500 text-white text-sm"
              >
                Detect location
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}