const pg = require('../config/postgres');
const env = require('../config/env');
const helper = require('../helpers/query');
const auth = require('./auth');

async function getAllClients() {
  const clients = await pg.query(
    "SELECT id, nome_completo, email, telefone FROM ClienteView"
  );

  const clientsInfo = [];
  clients.rows.forEach((row) => {
    clientsInfo.push({
      name: row.nome_completo,
      mail: row.email,
      phone: row.telefone,
    });
  });

  return clientsInfo;
}

async function getClientById(id) {
  const client = await pg.query(
    "SELECT id, nome_completo, email, telefone FROM ClienteView WHERE id = $1",
    [id]
  );

  if (client.rows.length > 0) {
    const clientElement = client.rows[0];
    const clientInfo = {
      name: clientElement.nome_completo,
      mail: clientElement.email,
      phone: clientElement.telefone,
    };
    return clientInfo;
  }
  return null;
}

async function insertClient(clientData) {
  const { nome_completo, email, telefone, senha } = clientData;

  const clientInsertQuery = 'INSERT INTO ClienteView (nome_completo, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING id';
  const clientInsertValues = [nome_completo, email, senha, telefone];
  const clientInsertResult = await pg.query(clientInsertQuery, clientInsertValues);

  const userId = clientInsertResult.rows[0].id;

  const insertedClient = {
    id: userId,
    name: nome_completo,
    mail: email,
    phone: telefone,
  };

  return insertedClient;
}

async function login(mail, password) {
  try {
    pg.query('BEGIN');

    const query = 'SELECT * FROM usuario WHERE email = $1';
    const result = await pg.query(query, [mail]);

    const user = helper.singleOrNone(result.rows);

    if (!user || password !== user.senha) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const userSpecializations = await retrieveUserSpecializations(user.id);
    const userData = {
      id: user.id,
      name: user.nome_completo,
      mail: user.email,
      types: userSpecializations,
    }

    pg.query('COMMIT');

    return auth.createToken(userData);
  } catch (err) {
    pg.query('ROLLBACK');
    throw err;
  }
}

async function retrieveUserSpecializations(userId) {
  const specializations = ['cliente', 'laboratorista', 'medico', 'administrador'];
  let userSpecializations = [];
  for (let i = 0; i < specializations.length; i++) {
    try {
      const query = `SELECT * FROM ${specializations[i]} WHERE usuario_id = $1`;
      const result = await pg.query(query, [userId]);

      const user = helper.singleOrNone(result.rows);
      if (user)
        userSpecializations.push(specializations[i]);
    } catch (err) {
      throw err;
    }
  }
  return userSpecializations;
}

module.exports = {
  getAllClients,
  getClientById,
  insertClient,
  login,
};
