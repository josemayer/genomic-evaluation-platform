const samples = require('../services/samples');
const notifications = require('../services/notifications');
const auth = require('../services/auth');
const permissions = require('../helpers/permissions');

async function listUserSamples(req, res) {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header',
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);
    const userSamples = await samples.getSamplesOfClient(user.userData.id);

    res.status(200);
    res.json({ userSamples });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

async function createSample(req, res) {
  const auth_header = req.headers.authorization;
  const body = req.body;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header',
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);

    if (!body.user_id) {
      res.status(400);
      res.json({
        message: 'Required user_id in body',
      });
      return res;
    }

    if (user.userData.id != body.user_id && permissions.isOnlyClient(user.userData.types)) {
      res.status(403);
      res.json({
        message: 'You do not have permission to register a sample for another user',
      });
      return res
    }

    const sample = await samples.registerNewSample(body.user_id);

    let notification_text = '';
    if (user.userData.id != body.user_id)
      notification_text = `Uma nova coleta foi registrada em seu nome, com identificador ${sample.id}`;
    else
      notification_text = `Sua coleta foi registrada com identificador ${sample.id}`;

    await notifications.sendNotification(body.user_id, notification_text);

    res.status(200);
    res.json({ sample });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

module.exports = {
  listUserSamples,
  createSample,
};
