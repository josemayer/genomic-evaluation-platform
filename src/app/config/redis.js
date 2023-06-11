const { Client } = require('redis-om');
const env = require('./env');
const { helloWorldSchema } = require('../../dbs/redis/schema/1-helloWorld');

const url = env.dbs.redis.url;

async function helloWorld() {
  const client = new Client()
  await client.open(url);
  const helloWorldRepositoy = client.fetchRepository(helloWorldSchema);

  await helloWorldRepositoy.createIndex();

  await helloWorldRepositoy.createAndSave({
    name: "Luã",
  });
  await helloWorldRepositoy.createAndSave({
    name: "Zé",
  });
  await helloWorldRepositoy.createAndSave({
    name: "Max",
  });

  /** @type {helloWorld[]} */
  const all = await helloWorldRepositoy.search().all();

  await client.close();

  return all;
}

/**
  * @typedef {Array<string | number | boolean>} redisCommand
  */

/**
  * @param {redisCommand} commands
  * @returns {Promise<Array<string>>}
  */
async function execute(commands) {
  const client = new Client()
  await client.open(url);
  const result =  await client.execute(commands);
  await client.close();
  return result;
}

async function set(key, value) {
  const client = new Client()
  await client.open(url);
  await client.set(key, value);
  await client.close();
}

async function get(key) {
  const client = new Client()
  await client.open(url);
  const value = await client.get(key);
  await client.close();
  return value;
}

module.exports = {
  set,
  get,
  helloWorld,
  execute
};
