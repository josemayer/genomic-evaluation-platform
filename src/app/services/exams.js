const pg = require('../config/postgres');

async function getAllExams() {
  const exams = await pg.query('SELECT * FROM exame');

  const examsArr = [];
  exams.rows.forEach(exam => {
    examsArr.push({
      id: exam.id,
      sample_id: exam.coleta_id,
      estimated_time: exam.tempo_estimado,
    });
  });
  return examsArr;
}

async function getExamById(id) {
  const exam = await pg.query('SELECT * FROM exame WHERE id = $1', [id]);

  if (exam.rows.length === 0) {
    return null;
  }

  const examObj = {
    sample_id: exam.rows[0].coleta_id,
    estimated_time: exam.rows[0].tempo_estimado,
  };
  return examObj;
}

async function getSampleOfExam(id) {
  const sample = await pg.query('SELECT c.* FROM exame AS e, coleta AS c WHERE e.id = $1 AND e.coleta_id = c.id', [id]);

  if (sample.rows.length === 0) {
    return null;
  }

  const sampleObj = {
    id: sample.rows[0].id,
    client_id: sample.rows[0].cliente_id,
    panel_type_id: sample.rows[0].tipo_painel_id,
    date: sample.rows[0].data,
  };
  return sampleObj;
}

async function getExamHistory(id) {
  const history = await pg.query('SELECT * FROM andamento_exame WHERE exame_id = $1', [id]);

  const historyArr = [];
  history.rows.forEach(h => {
    historyArr.push({
      progressed_by: h.usuario_id,
      status_name: h.estado_do_exame,
      date: h.data,
    });
  });
  return historyArr;
}

module.exports = {
  getAllExams,
  getExamById,
  getSampleOfExam,
  getExamHistory,
};
