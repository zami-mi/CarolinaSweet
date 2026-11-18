const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders.controller');

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.patch('/:id/favorite', ordersController.toggleFavorite);
router.post('/:id/duplicate', ordersController.duplicateOrder);

module.exports = router;
