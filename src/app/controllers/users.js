const users = require('../services/users');

async function listClients(req, res, next) {
  try {
    const clients = await users.getAllClients();
    res.status(200);
    res.json({
      clients: clients,
      meta: {
        total: clients.length,
        page: 1,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({
      message: err.message,
    });
  }
  return res;
}

module.exports = {
  listClients,
};
