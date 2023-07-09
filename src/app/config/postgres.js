const { Pool } = require('pg');
const env = require('./env');

const config = env.dbs.postgres;

const client = (type) => ({
  user: config.users[type].user,
  password: config.users[type].password,
  host: config.host,
  database: config.database,
  port: config.port
});

const poolUser = new Pool(client('user'));
const poolSystem = new Pool(client('system'));
const poolPostgres = new Pool(client('postgres'));

async function query(query, params, type = 'postgres') {
  if (type === 'user')
    return await poolUser.query(query, params);
  if (type === 'system')
    return await poolSystem.query(query, params);

  return await poolPostgres.query(query, params);
}

module.exports = {
  query,
};
