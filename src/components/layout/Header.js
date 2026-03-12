import { MapPin, Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Header() {
    const { cartCount } = useCart();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top row: Logo + Location + Icons */}
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

                    {/* Location picker */}
                    <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
                        <MapPin size={18} className="text-orange-500" />
                        <span className="hidden xs:inline">Jahanian, Punjab</span>
                        <ChevronDown size={16} className="opacity-70" />
                    </button>

                    {/* Cart + Profile icons */}
                    <div className="flex items-center gap-5 sm:gap-7">
                        <button className="relative text-gray-700 hover:text-orange-600 transition-colors">
                            <ShoppingCart size={22} strokeWidth={2.1} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-medium min-w-[18px] h-4 rounded-full flex items-center justify-center px-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button className="text-gray-700 hover:text-orange-600 transition-colors">
                            <User size={22} strokeWidth={2.1} />
                        </button>
                    </div>
                </div>

                {/* Bottom row: Search + Nav links */}
                <div className="h-12 flex items-center border-t border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

                    {/* Search bar */}
                    <div className="flex-1 max-w-2xl mx-auto relative mr-6 hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search biryani, pizza, groceries, restaurants..."
                            className="w-full pl-11 pr-4 py-2 bg-gray-100/80 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition"
                        />
                    </div>

                    {/* Nav links */}
                    <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700 hover:text-orange-600'}`
                            }
                        >
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
        </header>
    );
}