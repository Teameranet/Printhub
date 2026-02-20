const User = require('../models/User');
const { generateToken } = require('../../utils/tokenUtils');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name, phone, profileType } = req.body;

    // Validation
    if (!email || !password || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (email, password, name, phone)'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      profileType: profileType || 'Regular'
    });

    // Save user to database
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user (accepts email, or phone which is converted to digits@printhub.local to match signup)
const login = async (req, res) => {
  try {
    let { email, phone, password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone and password'
      });
    }

    if (phone != null && String(phone).trim() && !email) {
      const phoneDigits = String(phone).replace(/\D/g, '');
      if (phoneDigits.length) email = `${phoneDigits}@printhub.local`;
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide email or phone and password'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout user
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

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get current user error:', error);
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