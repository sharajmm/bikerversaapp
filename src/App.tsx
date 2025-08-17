import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Blog from './pages/Blog/Blog';
import Brands from './pages/Brands/Brands';
import BrandDetail from './pages/BrandDetail/BrandDetail';
import Contact from './pages/Contact/Contact';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:brandId" element={<BrandDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;