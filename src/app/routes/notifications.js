const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications');

router.get('/', notificationsController.listUserNotifications);
router.get('/todos', notificationsController.listUserToDos);

module.exports = router;
