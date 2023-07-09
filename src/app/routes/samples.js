const express = require('express');
const router = express.Router();
const samplesController = require('../controllers/samples');

router.get('/', samplesController.listUserSamples);
router.post('/new', samplesController.createSample);

module.exports = router;
