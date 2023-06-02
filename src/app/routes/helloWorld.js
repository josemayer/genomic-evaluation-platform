const express = require('express');
const router = express.Router();
const helloWorldController = require('../controllers/helloWorld');

router.get('/', helloWorldController.sayHello);
router.get('/env', helloWorldController.sayHelloWithEnv);
router.get('/name/:name', helloWorldController.sayHelloWithName);
router.get('/postgres', helloWorldController.sayHelloToAllInPostgres);

module.exports = router;
