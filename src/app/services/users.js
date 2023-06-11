const pg = require('../config/postgres');

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

module.exports = {
  getAllClients,
  getClientById,
  insertClient,
};