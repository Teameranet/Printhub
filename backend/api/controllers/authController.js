// Authentication Controller
// Implement your authentication logic here

// Mock user for demo purposes - extended with Supabase-compatible metadata
const DEMO_USER = {
  id: 'demo-123',
  name: 'Demo User',
  email: 'demo.user@printhub.local',
  phone: '9876543210',
  profileType: 'Regular',
  user_metadata: {
    full_name: 'Demo User',
    phone: '9876543210'
  }
};

const MOCK_TOKEN = 'mock-jwt-token-for-demo-purposes';

const register = async (req, res) => {
  try {
    const { email, password, name, phone, profileType } = req.body;

    // For demo purposes, we'll allow registration of the demo user
    // or any user by returning a mock response
    const newUser = {
      id: Date.now().toString(),
      name: name || 'New User',
      email: email,
      phone: phone || '',
      profileType: profileType || 'Regular',
      user_metadata: {
        full_name: name || 'New User',
        phone: phone || ''
      }
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token: MOCK_TOKEN
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase();

    // Check for demo user credentials
    if (normalizedEmail === 'demo.user@printhub.local' && password === 'password123') {
      return res.status(200).json({
        success: true,
        message: 'Demo login successful',
        user: DEMO_USER,
        token: MOCK_TOKEN
      });
    }

    // Fallback: simple validation for other "users"
    if (email && password) {
      const name = email.split('@')[0];
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'user-' + Date.now(),
          name: name,
          email: email,
          user_metadata: {
            full_name: name
          }
        },
        token: MOCK_TOKEN
      });
    }

    throw new Error('Invalid credentials');
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // For demo/development, return the demo user if a token is present
    res.status(200).json({
      success: true,
      user: DEMO_USER
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};