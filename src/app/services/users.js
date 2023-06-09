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

module.exports = {
  getAllClients,
  getClientById,
};
