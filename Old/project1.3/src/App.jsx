import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../frontend/user/pages/Home';
import About from '../frontend/user/pages/About';
import Services from '../frontend/user/pages/Services';
import PrivacyPolicy from '../frontend/user/pages/PrivacyPolicy';
import DeliveryPolicy from '../frontend/user/pages/DeliveryPolicy';
import TermsConditions from '../frontend/user/pages/TermsConditions';
import TrackOrder from '../frontend/user/pages/TrackOrder';
import Cart from '../frontend/user/pages/Cart';
import StoreLocator from '../frontend/user/pages/StoreLocator';
import Profile from '../frontend/user/pages/Profile';
import Header from '../frontend/user/components/Header';
import Footer from '../frontend/user/components/Footer';
import Toast from '../frontend/user/components/Toast';
import AdminDashboard from '../frontend/admin/pages/Dashboard';
import ProtectedRoute from '../frontend/admin/components/auth/ProtectedRoute';

const App = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route
            path="/*"
            element={
              <>
                <Header triggerToast={triggerToast} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/store-locator" element={<StoreLocator />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/delivery-policy" element={<DeliveryPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </Router>
  );
};

export default App;