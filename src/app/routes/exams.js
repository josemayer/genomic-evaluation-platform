const express = require('express');
const router = express.Router();
const examsController = require('../controllers/exams');

router.get('/', examsController.listExams);
router.get('/:id', examsController.examInfo);
router.post('/step/:type', examsController.stepExam);
router.get('/identify/:id', examsController.identifyExam);

module.exports = router;
