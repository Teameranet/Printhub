const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const { storage } = require('../../config/cloudinary');
const upload = multer({ storage });

// Public routes
// Calculate order price based on configuration (no auth required)
router.get('/calculate/price', orderController.calculateOrderPrice);

// Guest order: no login, just name + phone (must be before auth)
router.post('/guest', (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error uploading files to Cloudinary',
                error: err.message,
                details: err
            });
        }
        next();
    });
}, orderController.createGuestOrder);
// View guest order by ID (public, requires ?phone=)
router.get('/guest/:id', orderController.getGuestOrderById);

// All routes below require authentication
router.use(authMiddleware);

// ===== ADMIN ROUTES (must be before :id routes) =====

// Get all orders (admin only)
router.get('/admin/all', adminMiddleware, orderController.getAllOrders);

// Get order statistics (admin only)
router.get('/admin/stats', adminMiddleware, orderController.getOrderStats);

// ===== USER ROUTES =====

// Create new order (accept up to 5 files under field name 'files')
router.post('/', (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error uploading files to Cloudinary',
                error: err.message,
                details: err
            });
        }
        next();
    });
}, orderController.createOrder);

// Get all orders for current user
router.get('/', orderController.getOrders);

// Get specific order (user can view their own, admin can view any)
router.get('/:id', orderController.getOrderById);

// Update order (status, payment status, notes)
router.put('/:id', orderController.updateOrder);

// Delete order (soft delete)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
