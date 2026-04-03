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
import Checkout from './pages/Checkout';    
import Admin from './pages/Admin'   
import Orders from './pages/Orders';

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
          <Route path="/orders" element={<Orders />} />

          {/* Placeholder Pages */}
          <Route path="/orders" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28 pb-12 text-center">
                <div className="max-w-md mx-auto mt-20">
                  <h2 className="text-3xl font-bold mb-4">My Orders</h2>
                  <p className="text-gray-600">Your order history will appear here.</p>
                  <p className="text-sm text-gray-500 mt-8">Coming Soon...</p>
                </div>
              </main>
              <Footer />
            </div>
          } />

          <Route path="/profile" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28 pb-12 text-center">
                <div className="max-w-md mx-auto mt-20">
                  <h2 className="text-3xl font-bold mb-4">Profile</h2>
                  <p className="text-gray-600">Your profile settings will be here.</p>
                  <p className="text-sm text-gray-500 mt-8">Coming Soon...</p>
                </div>
              </main>
              <Footer />
            </div>
          } />

          <Route path="/help" element={
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1 pt-28 pb-12 text-center">
                <div className="max-w-md mx-auto mt-20">
                  <h2 className="text-3xl font-bold mb-4">Help Center</h2>
                  <p className="text-gray-600">How can we help you today?</p>
                  <p className="text-sm text-gray-500 mt-8">Coming Soon...</p>
                </div>
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