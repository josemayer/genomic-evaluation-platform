const express = require('express');
const router = express.Router();
const controller = require('../controllers/neo4j');

router.get('/addPerson/:id', controller.addPerson);
router.get('/listPeople', controller.listPeople);
router.get('/linkParent/:parent/:child/:distance', controller.linkParent);
router.get('/listFamily/:id', controller.listFamily);
router.get('/addCondition/:id', controller.addCondition);
router.get('/linkHasCondition/:pid/:cid', controller.linkHasCondition);
router.get('/listPersonConditions/:pid', controller.listPersonConditions);

module.exports = router;
