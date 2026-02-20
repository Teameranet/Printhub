const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role

// ===== PRICING ROUTES =====
// Get all pricing (no admin required - public can view)
router.get('/pricing', adminController.getAllPricing);

// Get pricing by type (no admin required - public can view)
router.get('/pricing/:serviceType', adminController.getPricingByType);

// Create/Update pricing (admin only)
router.post('/pricing', authMiddleware, adminMiddleware, adminController.setPricing);

// Delete pricing (admin only)
router.delete('/pricing/:id', authMiddleware, adminMiddleware, adminController.deletePricing);

// ===== SYSTEM SETTINGS ROUTES =====
// Get all settings (admin only)
router.get('/settings', authMiddleware, adminMiddleware, adminController.getSystemSettings);

// Get specific setting (admin only)
router.get('/settings/:key', authMiddleware, adminMiddleware, adminController.getSettingByKey);

// Update setting (admin only)
router.put('/settings', authMiddleware, adminMiddleware, adminController.updateSystemSetting);

// ===== DASHBOARD ROUTES =====
// Get dashboard statistics (admin only)
router.get('/dashboard/stats', authMiddleware, adminMiddleware, adminController.getDashboardStats);
// Get all orders (admin only)
router.get('/orders', authMiddleware, adminMiddleware, adminController.getAllOrders);

module.exports = router;
