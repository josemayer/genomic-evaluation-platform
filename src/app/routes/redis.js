const express = require('express');
const router = express.Router();
const redisController = require('../controllers/redis');

router.get('/get/:key', redisController.getValue);
router.get('/set/:key/:value', redisController.setKeyWithValue);
// 
module.exports = router;