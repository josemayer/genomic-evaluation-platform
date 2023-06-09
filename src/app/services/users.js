const pg = require('../config/postgres');

async function getAllClients() {
  const clients = await pg.query(
    "SELECT u.id, u.nome_completo, u.email, c.telefone FROM usuario AS u, cliente AS c WHERE u.id = c.usuario_id"
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
    "SELECT u.id, u.nome_completo, u.email, c.telefone FROM usuario AS u, cliente AS c WHERE u.id = c.usuario_id AND u.id = $1",
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

  const userInsertQuery = 'INSERT INTO usuario (nome_completo, email, senha) VALUES ($1, $2, $3) RETURNING id';
  const userInsertValues = [nome_completo, email, senha];
  const userInsertResult = await pg.query(userInsertQuery, userInsertValues);

  const userId = userInsertResult.rows[0].id;

  const clientInsertQuery = 'INSERT INTO cliente (usuario_id, telefone) VALUES ($1, $2)';
  const clientInsertValues = [userId, telefone];
  await pg.query(clientInsertQuery, clientInsertValues);

  const insertedClient = {
    id: userId,
    name: nome_completo,
    email,
    phone: telefone,
  };

  return insertedClient;
}

module.exports = {
  getAllClients,
  getClientById,
  insertClient,
};
