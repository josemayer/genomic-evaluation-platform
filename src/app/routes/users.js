const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/clients', usersController.listClients);
router.get('/client/:id', usersController.clientInfo);
router.post('/client/new', usersController.registerClient);
router.post('/login', usersController.login);
router.get('/loggedInfo', usersController.getLoginInfo);

module.exports = router;
