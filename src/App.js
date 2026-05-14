import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

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

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>

          {/* ====================== AUTH ROUTE (No Header/Footer) ====================== */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          {/* ====================== MAIN APP ROUTES (With Header & Footer) ====================== */}
          
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Home />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/cart" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Cart />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/restaurant/:id" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <RestaurantDetail />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/category/:name" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <CategoryPage />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/categories" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Categories />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/restaurants" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Restaurants />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/checkout" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Checkout />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/admin" element={<Admin />} />
          <Route path="/rider" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <main className="flex-1 py-10">
                <RiderDashboard />
              </main>
            </div>
          } />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <main className="flex-1 py-10">
                <VendorDashboard />
              </main>
            </div>
          } />
          <Route path="/orders" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28">
                <Orders />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/rider/profile" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <main className="flex-1 py-10">
                <RiderProfile />
              </main>
            </div>
          } />

          <Route path="/vendor/profile" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <main className="flex-1 py-10">
                <VendorProfile />
              </main>
            </div>
          } />

          {/* Placeholder Pages */}

          <Route path="/profile" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28 pb-12 text-center">
                <Profile />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/help" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28 pb-12">
                <Help />
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

        <Toaster position="top-center" />
      </Router>
    </CartProvider>
  );
}

export default App;