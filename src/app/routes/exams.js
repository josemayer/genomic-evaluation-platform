const express = require('express');
const router = express.Router();
const examsController = require('../controllers/exams');

router.get('/', examsController.listExams);
router.get('/:id', examsController.examInfo);
router.post('/step/:type', examsController.stepExam);

module.exports = router;
