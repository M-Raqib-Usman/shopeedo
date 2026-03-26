import { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Header() {
  const { cartCount } = useCart();
  
  const [userAddress, setUserAddress] = useState("Jahanian, Punjab");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Load saved address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('shopeedo-address');
    if (savedAddress) {
      setUserAddress(savedAddress);
    }
  }, []);

  // Save address to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopeedo-address', userAddress);
  }, [userAddress]);

  // Get current location using browser GPS
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    toast.loading("Detecting location...", { id: "location-toast" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For demo purposes (no real reverse geocoding without API key)
        // You can later integrate BigDataCloud or any free service
        const newAddress = "Near You • Jahanian, Punjab";
        setUserAddress(newAddress);
        toast.success("✅ Location updated successfully!", { 
          id: "location-toast",
          duration: 2500 
        });
      },
      (error) => {
        toast.error(
          error.code === 1 
            ? "Location access denied. Please allow or enter manually." 
            : "Unable to get your location. Please try again.",
          { id: "location-toast" }
        );
      }
    );
  };

  // Manual address change (simple prompt for demo)
  const changeAddress = () => {
    const newAddress = prompt("Enter your delivery address:", userAddress);
    if (newAddress && newAddress.trim() !== "") {
      setUserAddress(newAddress.trim());
      toast.success("Address updated!");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row: Logo + Location + Icons */}
        <div className="h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              S
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl tracking-tight text-gray-900">Shopeedo</span>
              <p className="text-xs text-gray-500 -mt-1">Eats • Grocery</p>
            </div>
          </div>

          {/* Location Picker - Clickable */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors cursor-pointer group"
               onClick={() => setIsLocationOpen(!isLocationOpen)}>
            <MapPin size={18} className="text-orange-500" />
            <div className="hidden xs:flex flex-col leading-tight">
              <span className="text-xs text-gray-500">Deliver to</span>
              <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                {userAddress.length > 35 ? userAddress.substring(0, 32) + "..." : userAddress}
              </span>
            </div>
            <ChevronDown size={16} className="opacity-70" />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-5 sm:gap-7">
            <NavLink
              to="/cart"
              className="relative text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart size={22} strokeWidth={2.1} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-medium min-w-[18px] h-4 rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <button className="text-gray-700 hover:text-orange-600 transition-colors">
              <User size={22} strokeWidth={2.1} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Search + Navigation */}
        <div className="h-12 flex items-center border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-auto relative mr-6 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search biryani, pizza, groceries, restaurants..."
              className="w-full pl-11 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => `transition-colors ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>
              Home
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `transition-colors ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>
              Orders
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `transition-colors ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>
              Profile
            </NavLink>
            <NavLink to="/help" className={({ isActive }) => `transition-colors ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`}>
              Help
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Location Options Dropdown (Simple for Demo) */}
      {isLocationOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-xl border border-gray-200 rounded-2xl py-4 px-5 w-80 z-50">
          <p className="font-medium text-gray-800 mb-3">Delivery Address</p>
          <div className="text-sm text-gray-600 mb-4">{userAddress}</div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={getCurrentLocation}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <MapPin size={18} /> Detect My Location
            </button>
            
            <button 
              onClick={changeAddress}
              className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-medium transition"
            >
              Enter Address Manually
            </button>
          </div>
          
          <button 
            onClick={() => setIsLocationOpen(false)}
            className="mt-4 text-xs text-gray-500 underline mx-auto block"
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
}