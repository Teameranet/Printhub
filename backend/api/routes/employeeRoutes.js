const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, authMiddlewareAllowQueryToken, employeeMiddleware } = require('../middleware/authMiddleware');

// Print view: token allowed in query for opening in new window
router.get('/print-view', authMiddlewareAllowQueryToken, employeeMiddleware, employeeController.getPrintView);

router.use(authMiddleware);
router.use(employeeMiddleware);

router.get('/orders', employeeController.getOrders);
router.put('/orders/:id/status', employeeController.updateOrderStatus);

module.exports = router;
