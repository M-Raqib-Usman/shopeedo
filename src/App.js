import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import RestaurantDetail from './pages/RestaurantDetail';
import CategoryPage from './pages/CategoryPage';
import Categories from './pages/Categories';
import Restaurants from './pages/Restaurants';
import Checkout from './pages/Checkout';    
import Admin from './pages/Admin';   
import Orders from './pages/Orders';
import RiderDashboard from './pages/RiderDashboard';
import VendorDashboard from './pages/VendorDashboard';
import VendorLogin from './pages/VendorLogin';
import Profile from './pages/Profile';
import Help from './pages/Help';
import RiderProfile from './pages/RiderProfile';
import VendorProfile from './pages/VendorProfile';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ====================== AUTH ROUTE (No Header/Footer) ====================== */}
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Auth /></PageTransition>} />

        {/* ====================== MAIN APP ROUTES (With Header & Footer) ====================== */}
        
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Home /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/cart" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Cart /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/restaurant/:id" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><RestaurantDetail /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/category/:name" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><CategoryPage /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/categories" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Categories /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/restaurants" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Restaurants /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/checkout" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Checkout /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/rider" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 py-10">
              <PageTransition><RiderDashboard /></PageTransition>
            </main>
          </div>
        } />
        <Route path="/vendor-login" element={<PageTransition><VendorLogin /></PageTransition>} />
        <Route path="/vendor" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 py-10">
              <PageTransition><VendorDashboard /></PageTransition>
            </main>
          </div>
        } />
        <Route path="/orders" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28">
              <PageTransition><Orders /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/rider/profile" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 py-10">
              <PageTransition><RiderProfile /></PageTransition>
            </main>
          </div>
        } />

        <Route path="/vendor/profile" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 py-10">
              <PageTransition><VendorProfile /></PageTransition>
            </main>
          </div>
        } />

        <Route path="/profile" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28 pb-12 text-center">
              <PageTransition><Profile /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        <Route path="/help" element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-28 pb-12">
              <PageTransition><Help /></PageTransition>
            </main>
            <Footer />
          </div>
        } />

        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-7xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
              <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-medium"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        } />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AnimatedRoutes />
        <Toaster position="top-center" />
      </Router>
    </CartProvider>
  );
}

export default App;