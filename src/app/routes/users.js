const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/clients', usersController.listClients);
router.get('/client/:id', usersController.clientInfo);
router.post('/client/new', usersController.registerClient);

module.exports = router;
