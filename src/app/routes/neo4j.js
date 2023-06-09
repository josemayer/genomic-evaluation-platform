const express = require('express');
const router = express.Router();
const controller = require('../controllers/neo4j');

router.get('/addPerson/:id', controller.addPerson);
router.get('/listPeople', controller.listPeople);
router.get('/linkParent/:parent/:child/:distance', controller.linkParent);
router.get('/listFamily/:id', controller.listFamily);

module.exports = router;
