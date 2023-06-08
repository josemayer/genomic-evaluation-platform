const express = require('express');
const router = express.Router();
const controller = require('../controllers/neo4j');

router.get('/add/:id', controller.addPerson);
router.get('/list', controller.listPeople);

module.exports = router;
