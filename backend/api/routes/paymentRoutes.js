const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Create Razorpay order (can be used by authenticated users or guests)
router.post('/create-order', paymentController.createRazorpayOrder);

// Verify payment (can be used by authenticated users or guests)
router.post('/verify', paymentController.verifyPayment);

// Webhook endpoint (public, called by Razorpay)
// Note: Raw body middleware is applied in server.js for this route
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
