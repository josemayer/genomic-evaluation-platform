const express = require('express');
const router = express.Router();
const examsController = require('../controllers/exams');

router.get('/', examsController.listExams);
router.get('/:id', examsController.examInfo);

module.exports = router;
