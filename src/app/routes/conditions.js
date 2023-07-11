const express = require('express');
const router = express.Router();
const conditionController = require('../controllers/conditions');

router.post('/add', conditionController.addCondition);
router.get('/list', conditionController.listAllConditions);

module.exports = router;
