import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-white font-bold text-2xl">Shopeedo</span>
          </div>
          <p className="text-sm">Fast delivery for Food & Groceries</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/about" className="hover:text-white">About Us</NavLink></li>
            <li><NavLink to="/careers" className="hover:text-white">Careers</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/terms" className="hover:text-white">Terms</NavLink></li>
            <li><NavLink to="/privacy" className="hover:text-white">Privacy</NavLink></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/help" className="hover:text-white">Help Center</NavLink></li>
            <li><a href="mailto:support@shopeedo.com" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © 2026 Shopeedo. All rights reserved. Made with ❤️ in Pakistan
      </div>
    </footer>
  );
}