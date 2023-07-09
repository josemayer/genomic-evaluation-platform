const pg = require('../config/postgres');
const time = require('../helpers/time');

async function getSamplesOfClient(client_id) {
  const samples = await pg.query('SELECT * FROM coleta WHERE cliente_id = $1', [client_id]);
  const samplesResult = samples.rows;

  const userSamples = [];
  samplesResult.forEach((sample) => {
    userSamples.push({
      id: sample.id,
      client_id: sample.cliente_id,
      panel_type_id: sample.tipo_painel_id,
      date: sample.data,
    });
  });
  return userSamples;
}

async function registerNewSample(client_id, panel_type_id) {
  const now = time.getFormattedNow();
  const newSample = await pg.query('INSERT INTO coleta (cliente_id, tipo_painel_id, data) VALUES ($1, $2, $3)',
    [client_id, panel_type_id, now]);

  return newSample;
}

module.exports = {
  getSamplesOfClient,
  registerNewSample,
};
