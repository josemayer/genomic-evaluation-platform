const exams = require('../services/exams');
const auth = require('../services/auth');

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
    let exam = await exams.getExamById(req.params.id);
    const history = await exams.getExamHistory(req.params.id);
    const sample = await exams.getSampleOfExam(req.params.id);
    const total = 1;

    if (!exam || isEmptyObj(exam) || exam.length === 0) {
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

async function stepExam(req, res) {
  const { type } = req.params;
  const body = req.body;
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header'
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);
    const step_result = await exams.stepExam(user.userData, body, type);

    res.status(200);
    res.json({
      step_result: step_result,
    });
  } catch(err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

async function identifyExam(req, res) {
  const { id } = req.params;
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header'
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);
    const conditions = await exams.getConditionsOfExam(user.userData, id);

    res.status(200);
    res.json({
      conditions_to_find: conditions,
    });
  } catch(err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }

}

async function listAllCompletedExamsWithConditionsOfUser(req, res) {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header'
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);
    const examsUser = await exams.getAllCompletedExamsWithConditionsForUser(user.userData.id);

    res.status(200);
    res.json({
      exams: examsUser,
    });
  } catch(err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
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
  stepExam,
  identifyExam,
  listAllCompletedExamsWithConditionsOfUser,
};
