const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients.controller');

router.get('/', clientsController.getClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.patch('/:id/status', clientsController.toggleClientStatus);

module.exports = router;
