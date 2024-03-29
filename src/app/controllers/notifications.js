const auth = require('../services/auth');
const notifications = require('../services/notifications');

async function listUserNotifications(req, res) {
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
    const userNotifications = await notifications.getNotifications(user.userData.id);

    res.status(200);
    res.json(userNotifications);
  } catch (err) {
    res.status(err.status_code || 500);
    res.json({
      message: err.message
    });
  }
  return res;
}

async function listUserToDos(req, res) {
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
    const userTodos = await notifications.getToDos(user.userData.types);

    res.status(200);
    res.json(userTodos);
  } catch (err) {
    res.status(err.status_code || 500);
    console.log(err)
    res.json({
      message: err.message
    });
  }
  return res;
}

module.exports = {
  listUserNotifications,
  listUserToDos,
};
