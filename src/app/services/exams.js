const pg = require('../config/postgres');
const redisService = require('../services/redis');
const notifications = require('../services/notifications');
const permissions = require('../helpers/permissions');
const time = require('../helpers/time');

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
    exam_id: exam.rows[0].id,
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

async function stepExam(user, body, type) {
  if (!type)
    throw new Error('Missing step type');

    if (type === 'enqueue') {
      const sample_id = body.sample_id;

      if (!sample_id)
        throw new Error('Missing sample id');

      return await putExamInQueue(sample_id, user);
    }

    if (type === 'process') {
      const exam_id = body.exam_id;
      const genes = body.genes;

      if (!exam_id)
        throw new Error('Missing exam id');

      if (!genes)
        throw new Error('Missing dna');

      return await processExam(exam_id, user, genes);
    }

    if (type === 'validate') {
      const exam_id = body.exam_id;

      if (!exam_id)
        throw new Error('Missing exam id');

      return await validateExam(exam_id, user);
    }

    return null;
}

async function estimateTime() {
  const exams = await getAllExams();

  let num_incomplete_exams = 0;
  for (let i = 0; i < exams.length; i++) {
    const exam = exams[i];
    const history = await getExamHistory(exam.id);

    if (history.length > 0) {
      const last_step = history[history.length - 1];
      if (last_step.status_name != 'completo')
        num_incomplete_exams++;
    }
  }

  if (num_incomplete_exams <= 1)
    return '1 day';
  return `${num_incomplete_exams} days`;
}

async function putExamInQueue(sample_id, user) {
  if (!permissions.hasType(user.types, 'cliente'))
    throw new Error('Only clients can enqueue exams');

  try {
    const formatted_date = time.getFormattedNow();

    await pg.query("BEGIN");

    const estimated_time = await estimateTime();
    const exam = await pg.query('INSERT INTO exame (coleta_id, tempo_estimado) VALUES ($1, $2) RETURNING *',
      [sample_id, estimated_time]);

    const exame_id = exam.rows[0].id;
    const step = await pg.query('INSERT INTO andamento_exame (exame_id, usuario_id, estado_do_exame, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [exame_id, user.id, 'na fila', formatted_date]);

    const notification_text = `O seu exame ${exame_id} foi criado, está na fila e será processado em breve!`;
    await notifications.sendNotification(user.id, notification_text);

    await pg.query("COMMIT");

    return await getExamById(exame_id);
  } catch (err) {
    await pg.query("ROLLBACK");
    throw err;
  }
  return null;
}

async function processExam(id, user, genes) {
  if (!permissions.hasType(user.types, 'laboratorista'))
    throw new Error('Only laboratory technicians can process exams');

  const user_id = parseInt(user.id);

  await redisService.addGenesToUser(user_id, genes);

  return null;
}

async function validateExam(id, user) {
  if (!permissions.hasType(user.types, 'medico'))
    throw new Error('Only doctors can validate exams');

  // pass
  return null;
}

async function getConditionsOfExam(user, id) {
  if (!permissions.hasType(user.types, 'laboratorista') && !permissions.hasType(user.types, 'medico'))
    throw new Error('Only laboratory technicians can get conditions of exams');
  // TODO(luatil): UNDO This id change
  id = 4;
  const conditions = await pg.query('select * from pode_identificar_condicao pc inner join condicao on pc.condicao_id = condicao.id where pc.condicao_id = $1', [id])

  const historyArr = [];
  conditions.rows.forEach(h => {
      historyArr.push(h.nome);
  });
  return historyArr;
  return ['asma, chule']
}

module.exports = {
  getAllExams,
  getExamById,
  getSampleOfExam,
  getExamHistory,
  stepExam,
  getConditionsOfExam
};
