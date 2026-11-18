const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.patch('/:id/status', ordersController.updateStatus);
router.patch('/:id/favorite', ordersController.toggleFavorite);
router.post('/:id/duplicate', ordersController.duplicateOrder);
router.post('/cleanup-cancelled', ordersController.cleanupCancelled);

module.exports = router;
