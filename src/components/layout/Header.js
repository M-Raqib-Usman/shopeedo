import { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingCart, ChevronDown, LogIn, LogOut, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Header() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState("Jahanian, Punjab");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Load user and address data
  useEffect(() => {
    const savedAddress = localStorage.getItem('shopeedo-address');
    if (savedAddress) setUserAddress(savedAddress);

    const savedUser = localStorage.getItem('shopeedo-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserName(user.name || "User");
      setUserEmail(user.email || "");
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
    setUserEmail("");
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
        setUserAddress("Near You • Jahanian, Punjab");
        toast.success("✅ Location detected successfully!", { id: "location", duration: 2000 });
        setIsLocationOpen(false);
      },
      () => {
        toast.dismiss("location");
        toast.error("Unable to detect location. Please enter manually.");
      }
    );
  };

  const enterAddressManually = () => {
    const newAddress = prompt("Enter your full delivery address:", userAddress);
    if (newAddress && newAddress.trim()) {
      setUserAddress(newAddress.trim());
      toast.success("Address updated successfully!");
      setIsLocationOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row */}
        <div className="h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl tracking-tight">Shopeedo</span>
              <p className="text-xs text-gray-500 -mt-1">Eats • Grocery</p>
            </div>
          </div>

          {/* Location Picker */}
          <div 
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-600 cursor-pointer transition-colors"
          >
            <MapPin size={18} className="text-orange-500" />
            <div className="hidden sm:block text-left">
              <span className="text-xs text-gray-500">Deliver to</span>
              <div className="font-medium text-gray-800 text-sm leading-tight">
                {userAddress.length > 38 ? userAddress.substring(0, 35) + "..." : userAddress}
              </div>
            </div>
            <ChevronDown size={16} />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-6">
            <NavLink to="/cart" className="relative text-gray-700 hover:text-orange-600 transition">
              <ShoppingCart size={23} strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[17px] h-4 rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Auth / Profile Section */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 relative group">
                <div 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 cursor-pointer hover:text-orange-600 transition"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-medium text-orange-600">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{userName}</span>
                </div>

                {/* Logout Dropdown */}
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 transition hidden group-hover:block"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-orange-600 transition"
              >
                <LogIn size={23} />
                <span className="hidden md:block text-sm font-medium">Login</span>
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
              className="w-full pl-12 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <nav className="flex gap-7 text-sm font-medium ml-auto">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-orange-600 font-semibold" : "text-gray-700 hover:text-orange-600"}>Home</NavLink>
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