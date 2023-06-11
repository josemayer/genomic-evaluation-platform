const express = require('express');
const router = express.Router();
const redisController = require('../controllers/redis');

router.get('/get/:key', redisController.getValue);
router.get('/set/:key/:value', redisController.setKeyWithValue);
router.get('/helloWorld', redisController.helloWorldFromRedis);
router.get('/addCondition/:id/:sequences', redisController.addCondition);
router.get('/addUser/:id/:sequences', redisController.addUser);
router.get('/findUserConditions/:userId', redisController.findUserConditions);

module.exports = router;
