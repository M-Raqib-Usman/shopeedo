import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';   
import Header from './components/layout/Header';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';

function App() {
  return (
    <CartProvider>   {/* ← wrap everything */}
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1 pt-28">  {/* increased pt because header has 2 rows */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/cart" element={<Cart />} />
              {/* Later: /cart, /orders, /profile */}
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;