import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header.jsx';
import Home from './user/Home.jsx';
import { NormalPrint } from './user/NormalPrint.jsx';
import AdvancedPrint from './user/AdvancedPrint.jsx';
import Profile from './user/Profile.jsx';
import Orders from './user/Orders.jsx';
import Order from './user/Order.jsx';
import AuthModal from './user/AuthModal.jsx';
import Admin from './admin/Admin.jsx';
import Employee from './employee/Employee.jsx';
import { Checkout } from './user/Checkout.jsx';
import { Invoice } from './user/Invoice.jsx';
import Cart from './user/Cart.jsx';
import './App.css';
// Import component styles
import './components/Header.css';
import './user/Home.css';
import './user/NormalPrint.css';
import './user/AdvancedPrint.css';
import './user/Profile.css';
import './user/Order.css';
import './user/AuthModal.css';
import './user/Checkout.css';
import './user/Cart.css';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Map internal page names to routes for Header compatibility
  const handleNavigate = (page) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'normalPrint':
        navigate('/normal-print');
        break;
      case 'advancedPrint':
        navigate('/advanced-print');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'order':
        navigate('/order');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine current page for Header active state
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/normal-print') return 'normalPrint';
    if (path === '/advanced-print') return 'advancedPrint';
    if (path === '/profile') return 'profile';
    if (path === '/orders') return 'orders';
    if (path === '/order') return 'order';
    if (path === '/checkout') return 'checkout';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <img src="/Printhub_logo.png" alt="PrintHub" className="loading-logo" />
          <div className="loading-spinner"></div>
          <p>Loading PrintHub...</p>
        </div>
      </div>
    );
  }

  const isAdmin = !!(user && String(user.role || '').toLowerCase().trim() === 'admin');
  const isEmployee = !!(user && String(user.role || '').toLowerCase().trim() === 'employee');

  // Admin: if authenticated admin, stay on admin
  if (isAuthenticated && isAdmin) {
    if (!location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" replace />;
    }
    return <Admin onLogout={handleLogout} user={user} />;
  }

  // Employee: if authenticated employee, show employee portal
  if (isAuthenticated && isEmployee) {
    if (!location.pathname.startsWith('/employee')) {
      return <Navigate to="/employee" replace />;
    }
    return <Employee onLogout={handleLogout} user={user} />;
  }

  // Protect admin routes
  if (location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  // Protect employee routes
  if (location.pathname.startsWith('/employee')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app">
      <Header
        onOpenAuth={openAuthModal}
        onNavigate={handleNavigate}
        currentPage={getCurrentPage()}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onNavigate={handleNavigate} onOpenAuth={openAuthModal} />} />
          <Route path="/normal-print" element={<NormalPrint initialSpecs={{}} />} />
          <Route path="/advanced-print" element={<AdvancedPrint onNavigate={handleNavigate} onOpenAuth={openAuthModal} />} />
          <Route path="/profile" element={<Profile onNavigate={handleNavigate} />} />
          <Route path="/orders" element={<Orders onNavigate={handleNavigate} />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/invoice/:orderId" element={<Invoice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src="/Printhub_logo.png" alt="PrintHub" className="footer-logo" />
              <p className="footer-tagline">A Better Way To Print</p>
              <div className="footer-social">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">📷</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Services</h4>
              <ul>
                <li><button onClick={() => handleNavigate('normalPrint')}>Normal Print</button></li>
                <li><button onClick={() => handleNavigate('advancedPrint')}>Advanced Print</button></li>
                <li><a href="#">Business Cards</a></li>
                <li><a href="#">Posters & Banners</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Refund Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} PrintHub. All rights reserved.</p>
            <div className="footer-payment">
              <span>Payment Methods:</span>
              <span className="payment-icons">💳 📱 🏦 💰</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        mode={authMode}
      />
    </div>
  );
};

function App() {
  return (
    <AppContent />
  );
}

export default App;