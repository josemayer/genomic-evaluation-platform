const pg = require('../config/postgres');
const time = require('../helpers/time');

async function getSamplesOfClient(client_id) {
  const samples = await pg.query('SELECT * FROM coleta WHERE cliente_id = $1', [client_id], 'user');
  const samplesResult = samples.rows;

  const userSamples = [];
  samplesResult.forEach((sample) => {
    userSamples.push({
      id: sample.id,
      client_id: sample.cliente_id,
      date: sample.data,
    });
  });
  return userSamples;
}

async function getSampleById(sample_id) {
  const sample = await pg.query('SELECT * FROM coleta WHERE id = $1', [sample_id], 'user');
  const sampleResults = sample.rows;

  return {
    id: sampleResults[0].id,
    client_id: sampleResults[0].cliente_id,
    date: sample.data,
  };
}

async function registerNewSample(client_id) {
  const now = time.getFormattedNow();
  const newSample = await pg.query('INSERT INTO coleta (cliente_id, data) VALUES ($1, $2) RETURNING *',
    [client_id, now], 'user');

  return newSample.rows[0];
}

module.exports = {
  getSamplesOfClient,
  getSampleById,
  registerNewSample,
};
