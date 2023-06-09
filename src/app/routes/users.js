const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/clients', usersController.listClients);
router.get('/client/:id', usersController.clientInfo);

module.exports = router;
