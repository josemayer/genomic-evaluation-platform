const exams = require('../services/exams');

async function listExams(req, res, next) {
  try {
    const allExams = await exams.getAllExams();

    const examsArr = [];
    for (const exam of allExams) {
      const history = await exams.getExamHistory(exam.id);
      const sample = await exams.getSampleOfExam(exam.id);

      examsArr.push({
        id: exam.id,
        estimated_time: exam.estimated_time,
        history: history,
        sample: sample,
      });
    }

    res.status(200);
    res.json({
      exams: examsArr,
      meta: {
        total: examsArr.length,
        page: 1,
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

async function examInfo(req, res, next) {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    res.json({
      message: 'Required id'
    });
    return res;
  }

  try {
    const exam = await exams.getExamById(req.params.id);
    const history = await exams.getExamHistory(req.params.id);
    const sample = await exams.getSampleOfExam(req.params.id);
    const total = 1;

    if (!exam || isEmptyObj(exam) || exam.length == 0) {
      res.status(404);
      res.json({
        message: 'Not found',
      });
      return res;
    }

    if (isArray(exam)) {
      exam = exam[0];
    }

    res.status(200);
    res.json({
      exam: {
        id: exam.id,
        estimated_time: exam.estimated_time,
        history: history,
        sample: sample,
      },
      meta: {
        total: total,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

function isArray(obj) {
 return Array.isArray(obj);
}

function isEmptyObj(obj) {
 return Object.keys(obj).length === 0;
}

module.exports = {
  listExams,
  examInfo,
};
