const pg = require('../config/postgres');
const time = require('../helpers/time.js');

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

module.exports = {
  sendNotification,
  getNotifications
};
