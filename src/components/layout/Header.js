import { useState, useEffect } from 'react';
import { MapPin, Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Header() {
  const { cartCount } = useCart();
  
  const [userAddress, setUserAddress] = useState("Jahanian, Punjab");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Load saved address
  useEffect(() => {
    const saved = localStorage.getItem('shopeedo-address');
    if (saved) setUserAddress(saved);
  }, []);

  // Save address
  useEffect(() => {
    localStorage.setItem('shopeedo-address', userAddress);
  }, [userAddress]);

  // Improved Location Detection
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in your browser");
      return;
    }

    toast.loading("Detecting your location...", { id: "location" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For demo - showing a nice address instead of coordinates
        const demoAddress = "Near You • Jahanian, Punjab";
        setUserAddress(demoAddress);
        toast.success("✅ Location detected successfully!", { 
          id: "location",
          duration: 2500 
        });
        setIsLocationOpen(false);
      },
      (error) => {
        toast.dismiss("location"); // Remove loading toast
        if (error.code === 1) {
          toast.error("Location access denied. Please enter address manually.", {
            duration: 4000,
            icon: '📍'
          });
        } else {
          toast.error("Unable to get location. Please try manually.", {
            duration: 4000
          });
        }
      }
    );
  };

  const enterAddressManually = () => {
    const newAddress = prompt("Enter your full delivery address:", userAddress);
    if (newAddress && newAddress.trim() !== "") {
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

          {/* Icons */}
          <div className="flex items-center gap-6">
            <NavLink to="/cart" className="relative text-gray-700 hover:text-orange-600 transition">
              <ShoppingCart size={23} strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[17px] h-4 rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <User size={23} className="text-gray-700 hover:text-orange-600 cursor-pointer" />
          </div>
        </div>

        {/* Bottom Row - Search + Nav */}
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

      {/* Location Modal */}
      {isLocationOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center" onClick={() => setIsLocationOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-1">Delivery Location</h3>
              <p className="text-gray-600 text-sm mb-6">Where should we deliver your order?</p>

              <div className="space-y-3">
                <button
                  onClick={getCurrentLocation}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
                >
                  <MapPin size={20} />
                  Detect My Location
                </button>

                <button
                  onClick={enterAddressManually}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium transition"
                >
                  Enter Address Manually
                </button>
              </div>
            </div>

            <div className="border-t p-4">
              <button 
                onClick={() => setIsLocationOpen(false)}
                className="w-full text-gray-500 py-2 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}