const pg = require('../config/postgres');

async function getAll() {
  const names = await pg.query('SELECT name FROM hello_world');
  const helloWorlds = [];

  names.rows.forEach((row) => {
    helloWorlds.push(`Hello, ${row.name}!`);
  });

  return helloWorlds;
}

module.exports = {
  getAll,
};
