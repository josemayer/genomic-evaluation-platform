const express = require('express');
const router = express.Router();
const redisController = require('../controllers/redis');

router.get('/addUser/:id/:sequences', redisController.addUser);
router.get('/addCondition/:id/:prob/:sequences', redisController.addCondition);
router.get('/searchAllUsers', redisController.searchAllUsers);
router.get('/findUserConditions/:userId', redisController.findUserConditions);

module.exports = router;
