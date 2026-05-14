import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, AppWindow as AppStore, Play as PlayStore } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 overflow-hidden relative">
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-orange-500/20">
                S
              </div>
              <span className="text-3xl font-black tracking-tighter">Shopeedo</span>
            </div>
            <p className="text-gray-400 leading-relaxed font-medium">
              Bringing the flavors of Sahiwal to your doorstep. The most reliable food delivery platform in the city.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all transform hover:scale-110 active:scale-95 group">
                  <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-black mb-8 tracking-tighter">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Restaurants', 'Categories', 'Orders', 'Profile'].map((item) => (
                <li key={item}>
                  <NavLink 
                    to={`/${item === 'Home' ? '' : item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-orange-500 transition-colors font-bold text-sm uppercase tracking-widest"
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-black mb-8 tracking-tighter">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-orange-500 shrink-0" size={20} />
                <span className="text-gray-400 font-medium">Main Boulevard, Sahiwal, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-orange-500 shrink-0" size={20} />
                <span className="text-gray-400 font-medium">+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-orange-500 shrink-0" size={20} />
                <span className="text-gray-400 font-medium">hello@shopeedo.com</span>
              </li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-xl font-black mb-8 tracking-tighter">Get the App</h4>
            <div className="space-y-4">
              <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl flex items-center gap-4 transition-all border border-gray-700 hover:border-orange-500 group">
                <AppStore size={28} className="text-orange-500" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-500">Download on the</p>
                  <p className="text-lg font-black leading-none">App Store</p>
                </div>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl flex items-center gap-4 transition-all border border-gray-700 hover:border-orange-500 group">
                <PlayStore size={28} className="text-orange-500" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-500">Get it on</p>
                  <p className="text-lg font-black leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-bold">
            © {new Date().getFullYear()} Shopeedo. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;