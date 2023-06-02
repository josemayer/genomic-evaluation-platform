const { Pool } = require('pg');
const env = require('./env');

const postgres = env.dbs.postgres;
const pool = new Pool(postgres);

async function query(query, params) {
  return await pool.query(query, params);
}

module.exports = {
  query,
};
