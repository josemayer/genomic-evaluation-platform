const pg = require('../config/postgres');
const redisService = require('../services/redis');

async function addCondition(description, condition_name, prob_pop, genetic_information) {
    const conditionResult = await pg.query(
      `INSERT INTO condicao (descricao, nome, prob_populacao)
      VALUES ($1, $2, $3) RETURNING *`,
      [description, condition_name, prob_pop], 'user');

    const condition_id = parseInt(conditionResult.rows[0].id);

    redisService.addCondition(condition_id, parseFloat(prob_pop), genetic_information);

    let query = 'INSERT INTO condicao_sequencia_dna (condicao_id, sequencia_dna, prob_seq, prob_seq_dado_cond) VALUES ';

    let values = [];

    for (let i = 0; i < genetic_information.length; i++) {
        values.push(format(condition_id, genetic_information[i]));
    }

    values = values.join(', ');

    query += values;

    const conditionSequenceResult = await pg.query(query, [], 'user');

    return condition_id;
}

function format(conditionId, genetic_information) {
    return `(${parseInt(conditionId)}, '${genetic_information.sequence}', ${parseFloat(genetic_information.probabilityInPopulation)}, ${parseFloat(genetic_information.probabilityGivenSequence)})`;
}

async function listAllConditions() {
  let ret = await pg.query('SELECT id, nome FROM condicao')
  return ret.rows
}

async function listAllConditionsWithExam(exam_id) {
  let conditions = await pg.query(
    `SELECT c.id, c.nome, c.descricao, ic.probabilidade
    FROM identifica_condicao AS ic, condicao AS c
    WHERE ic.exame_id = $1 AND ic.condicao_id = c.id`,
    [exam_id], 'user'
  )

  return conditions.rows
}

module.exports = {
  addCondition,
  listAllConditions,
  listAllConditionsWithExam,
}
