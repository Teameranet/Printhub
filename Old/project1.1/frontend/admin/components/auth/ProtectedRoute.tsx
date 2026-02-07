import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminEmail = localStorage.getItem('adminEmail');

  useEffect(() => {
    if (!isAdmin || !adminEmail) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      navigate('/');
    }
  }, [isAdmin, adminEmail, navigate]);

  if (!isAdmin || !adminEmail) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;