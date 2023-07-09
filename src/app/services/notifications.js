const pg = require('../config/postgres');
const time = require('../helpers/time.js');

async function sendNotification (user_id, notification_text) {
  const now = time.getFormattedNow();
  const notification = await pg.query(`
    INSERT INTO notificacao (usuario_id, data, visualizado, texto)
    VALUES ($1, $2, $3, $4);
  `, [user_id, now, false, notification_text], 'system');
}

module.exports = {
  sendNotification,
};
