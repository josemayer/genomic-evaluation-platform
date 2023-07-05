const users = require('../services/users');
const auth = require('../services/auth');

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

async function clientInfo(req, res, next) {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    res.json({
      message: 'Required id',
    });
    return res;
  }

  try {
    let client = await users.getClientById(id);
    let total = 1;

    if (!client || isEmptyObj(client) || client.length == 0) {
      res.status(404);
      res.json({
        message: 'Not found',
      });
      return res;
    }

    if (isArray(client)) {
      client = client[0];
    }

    res.status(200);
    res.json({
      client: client,
      meta: {
        total: total,
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({
      message: err.message,
    });
  }
  return res;
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}

async function registerClient(req, res, next) {
  const { nome_completo, email, telefone, senha } = req.body;

  if (!nome_completo || !email || !telefone || !senha) {
    res.status(400);
    res.json({
      message: 'Incomplete fields',
    });
    return res;
  }

  try {
    const clientData = {
      nome_completo,
      email,
      telefone,
      senha,
    };

    const insertedClient = await users.insertClient(clientData);

    res.status(201);
    res.json({
      message: 'Client registered successfully',
      client: insertedClient,
    });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({
      message: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const { mail, password } = req.body;
    const token = await users.login(mail, password);
    res.json({ token });
  } catch (err) {
    console.error(`Error during login:`, err.message);
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

function getLoginInfo(req, res) {
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header',
    });

    return;
  }

  try {
    const info = auth.decodeToken(auth_header);

    res.status(200);
    res.json(info);
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({
      message: err.message,
    });
  }
}

module.exports = {
  listClients,
  clientInfo,
  registerClient,
  login,
  getLoginInfo,
};
