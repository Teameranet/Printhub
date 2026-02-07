import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

// Local User Store Helper
const getLocalUsers = () => JSON.parse(localStorage.getItem('local_users') || '[]');
const saveLocalUser = (user) => {
  const users = getLocalUsers();
  const existingIndex = users.findIndex(u => u.phone === user.phone);
  if (existingIndex > -1) users[existingIndex] = user;
  else users.push(user);
  localStorage.setItem('local_users', JSON.stringify(users));
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authAPI.getCurrentUser();
          setUser(data.user);
        } catch (apiErr) {
          // If server is down, check local users
          if (apiErr.message.includes('Could not connect')) {
            const users = getLocalUsers();
            const localUser = users.find(u => `local_token_${u.phone}` === token);
            if (localUser) {
              setUser(localUser);
            } else {
              localStorage.removeItem('token');
            }
          } else {
            localStorage.removeItem('token');
          }
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login({ email, password });

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }

      return data;
    } catch (err) {
      // Fallback for offline mode
      if (err.message.includes('Could not connect')) {
        const phone = email.split('@')[0]; // Extract phone from mocked email
        const users = getLocalUsers();
        const localUser = users.find(u => u.phone === phone && u.password === password);

        if (localUser) {
          const mockToken = `local_token_${localUser.phone}`;
          localStorage.setItem('token', mockToken);
          setUser(localUser);
          return { user: localUser, token: mockToken };
        }
        throw new Error('Invalid credentials (Offline Mode)');
      }

      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await authAPI.register(userData);

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      }

      return data;
    } catch (err) {
      // Fallback for offline mode
      if (err.message.includes('Could not connect')) {
        const mockUser = {
          ...userData,
          id: `local_${Date.now()}`,
          isLocal: true
        };
        saveLocalUser(mockUser);
        const mockToken = `local_token_${mockUser.phone}`;
        localStorage.setItem('token', mockToken);
        setUser(mockUser);
        return { user: mockUser, token: mockToken };
      }

      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};