const express = require('express');
const router = express.Router();
const panelsController = require('../controllers/panels');

router.post('/types/new', panelsController.registerPanelWithConditions);
router.get('/types/list', panelsController.listAllPanelsTypes);

module.exports = router;
