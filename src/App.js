import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        <Header />

        <main className="flex-1 pt-14 md:pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/cart" element={<Cart />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/orders" element={<Orders />} /> */}
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;