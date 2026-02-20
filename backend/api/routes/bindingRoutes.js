const express = require('express');
const router = express.Router();
const bindingPriceController = require('../controllers/bindingPriceController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// ===== PUBLIC ROUTES (No auth required) =====

// Get all binding types
router.get('/types', bindingPriceController.getAllBindingTypes);

// Get all binding prices
router.get('/prices', bindingPriceController.getAllBindingPrices);

// Get prices for specific binding type
router.get('/prices/:bindingType', bindingPriceController.getPricesByBindingType);

// Get price for specific configuration
router.get('/price-config', bindingPriceController.getPriceForConfig);

// ===== ADMIN ROUTES (Auth required) =====

// Create new binding type
router.post(
  '/types',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.createBindingType
);

// Update binding type
router.put(
  '/types/:id',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.updateBindingType
);

// Delete binding type
router.delete(
  '/types/:id',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.deleteBindingType
);

// Create new binding price rule
router.post(
  '/prices',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.createBindingPrice
);

// Update binding price rule
router.put(
  '/prices/:id',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.updateBindingPrice
);

// Delete binding price rule
router.delete(
  '/prices/:id',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.deleteBindingPrice
);

// Bulk create binding prices
router.post(
  '/prices-bulk',
  authMiddleware,
  adminMiddleware,
  bindingPriceController.bulkCreateBindingPrices
);

module.exports = router;
