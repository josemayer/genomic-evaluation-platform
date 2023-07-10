const express = require('express');
const router = express.Router();
const conditionController = require('../controllers/conditions');

router.post('/add', conditionController.addCondition);

module.exports = router;
