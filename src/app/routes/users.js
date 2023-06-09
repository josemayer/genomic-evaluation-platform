const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/clients', usersController.listClients);

module.exports = router;