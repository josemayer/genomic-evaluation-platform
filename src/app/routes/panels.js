const express = require('express');
const router = express.Router();
const panelsController = require('../controllers/panels');

router.post('/types/new', panelsController.registerPanelWithConditions);

module.exports = router;
