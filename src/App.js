import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';   
import { Toaster } from 'react-hot-toast';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';     // ← ADD THIS LINE
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

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
              {/* Add more routes later */}
            </Routes>
          </main>

          <Footer />   {/* ← Footer added here */}
        </div>

        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '9999px',
              padding: '14px 22px',
            },
          }}
        />
      </Router>
    </CartProvider>
  );
}

export default App;