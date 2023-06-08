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

module.exports = {
  getAllClients,
};
