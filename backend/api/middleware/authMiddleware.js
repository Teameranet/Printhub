const { verifyToken } = require('../../utils/tokenUtils');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token'
    });
  }
};

// Same as authMiddleware but also accepts token from query (for print-view opened in new window)
const authMiddlewareAllowQueryToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid or expired token'
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {

    console.log('Admin Middleware called for user:', req.user?.id);
    // User must be authenticated first
    if (!req.user || !req.user.id) {
      console.error('No user in request payload');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Fetch user from database to check role
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error('User not found in database:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User found - Role (raw):', user.role, 'Email:', user.email);
    const roleStr = String(user.role || '').toLowerCase().trim();
    console.log('Normalized role:', roleStr);

    if (roleStr !== 'admin') {
      console.error('User is not admin. Current role:', user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(403).json({
      success: false,
      message: error.message || 'Access denied'
    });
  }
};

// Allow access for admin or employee
const employeeMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const roleStr = String(user.role || '').toLowerCase().trim();
    if (roleStr !== 'admin' && roleStr !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee or Admin only.'
      });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    console.error('Employee middleware error:', error);
    res.status(403).json({
      success: false,
      message: error.message || 'Access denied'
    });
  }
};

module.exports = {
  authMiddleware,
  authMiddlewareAllowQueryToken,
  adminMiddleware,
  employeeMiddleware
};