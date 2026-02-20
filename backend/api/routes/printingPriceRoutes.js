const express = require('express');
const router = express.Router();
const printingPriceController = require('../controllers/printingPriceController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/authMiddleware');

// ===== PUBLIC ROUTES (No authentication required) =====

// Get all active printing prices (public)
router.get('/', printingPriceController.getAllPrintingPrices);

// Get prices by service type (public)
router.get('/by-service/:serviceType', printingPriceController.getPricesByServiceType);

// Get price for specific configuration (public)
router.get('/config', printingPriceController.getPriceForConfig);

// Check for existing pricing rules (public)
router.get('/check/existing', printingPriceController.checkExistingPrice);

// ===== ADMIN ROUTES (Authentication & Admin role required) =====

// Initialize default pricing rules (admin only)
router.post('/init/defaults', authMiddleware, adminMiddleware, printingPriceController.initializeDefaultPrices);

// Create new pricing rule (admin only)
router.post('/', authMiddleware, adminMiddleware, printingPriceController.createPrintingPrice);

// Bulk create pricing rules (admin only)
router.post('/bulk/create', authMiddleware, adminMiddleware, printingPriceController.bulkCreatePrintingPrices);

// Update pricing rule (admin only)
router.put('/:id', authMiddleware, adminMiddleware, printingPriceController.updatePrintingPrice);

// Delete pricing rule (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, printingPriceController.deletePrintingPrice);

module.exports = router;

