import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';   
import { Toaster } from 'react-hot-toast'; 
import Checkout from './pages/Checkout';  

import Header from './components/layout/Header';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-1 pt-28">  
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* Later: /orders, /profile, /checkout */}
            </Routes>
          </main>
        </div>

        {/* Toast Notifications - Global */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '9999px',
              padding: '14px 22px',
              fontSize: '15px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#f97316',   // Orange-500 - matches your Shopeedo theme
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </CartProvider>
  );
}

export default App;