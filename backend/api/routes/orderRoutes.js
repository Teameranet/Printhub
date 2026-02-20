const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// multer setup - store in backend/uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', '..', 'uploads'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});
const upload = multer({ storage });

// Public routes
// Calculate order price based on configuration (no auth required)
router.get('/calculate/price', orderController.calculateOrderPrice);

// Guest order: no login, just name + phone (must be before auth)
router.post('/guest', upload.array('files', 5), orderController.createGuestOrder);
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
router.post('/', upload.array('files', 5), orderController.createOrder);

// Get all orders for current user
router.get('/', orderController.getOrders);

// Get specific order (user can view their own, admin can view any)
router.get('/:id', orderController.getOrderById);

// Update order (status, payment status, notes)
router.put('/:id', orderController.updateOrder);

// Delete order (soft delete)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
