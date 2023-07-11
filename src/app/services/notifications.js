const pg = require('../config/postgres');
const time = require('../helpers/time.js');
const permissions = require('../helpers/permissions.js');

async function sendNotification (user_id, notification_text) {
  const now = time.getFormattedNow();
  const notification = await pg.query(`
    INSERT INTO notificacao (usuario_id, data, visualizado, texto)
    VALUES ($1, $2, $3, $4);
  `, [user_id, now, false, notification_text], 'system');
}

async function getNotifications (user_id) {
  try {
    pg.query(`BEGIN`, [], 'system');

    const notifications = await pg.query(`
      SELECT * FROM notificacao WHERE usuario_id = $1 ORDER BY data DESC;
    `, [user_id], 'system');

    await readAllNotifications();

    await pg.query(`COMMIT`, [], 'system');

    return notifications.rows;
  } catch (err) {
    await pg.query(`ROLLBACK`, [], 'system');
    throw err;
  }
  return [];
}

async function readAllNotifications () {
  const notification = await pg.query(`
    UPDATE notificacao SET visualizado=true WHERE visualizado=false;
  `, [], 'system');
}

async function getToDos(userTypes) {
  let res = []
  if (permissions.hasType(userTypes, 'laboratorista')) {
    const query = await pg.query('SELECT exame_id FROM EstadoExameView WHERE estado_do_exame = \'na fila\'')
    let num = parseInt(query.rowCount)

    if (num > 0) {
      res.push(`Existe${num==1?'':'m'} ${num} exames na fila de execução`);
      for (let i = 0; i < num; i++) {
      	res.push(`  - ${query.rows[i].exame_id}`)
      }
    }
  }

  if (permissions.hasType(userTypes, 'medico')) {
    const query = await pg.query('SELECT exame_id FROM EstadoExameView WHERE estado_do_exame = \'processado\'')
    let num = parseInt(query.rowCount)

    if (num > 0) {
      res.push(`Existe${num==1?'':'m'} ${num} exame${num==1?'':'s'} na fila de avaliação`);
      for (let i = 0; i < num; i++) {
      	res.push(`  - ${query.rows[i].exame_id}`)
      }
    }
  }
  return res;
}

module.exports = {
  sendNotification,
  getNotifications,
  getToDos,
};
