const redis = require('redis');
const env = require('./env');

const redis_env = env.dbs.redis;

// NOTE(luatil):  Code based on https://www.npmjs.com/package/redis
const client = redis.createClient(redis_env);
client.on('error', err => console.log('Redis Client Error', err));

// NOTE(luatil): Not sure if we should always create a new connection
async function set(key, value) {
  await client.connect();
  await client.set(key, value);
  await client.disconnect();
}

async function get(key) {
  await client.connect();
  const value = await client.get(key);
  await client.disconnect();
  return value;
}

module.exports = {
  set,
  get
};
