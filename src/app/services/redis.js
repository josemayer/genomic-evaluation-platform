const redis = require('../config/redis');

async function helloWorld() {
  const result = await redis.helloWorld();
  const set = new Set(result.map((el) => el.name).filter((el) => el));
  return Array.from(set);
}

async function set(key, value) {
  await redis.set(key, value);

  return `Setting ${key}:${value}`;
}

async function get(key) {
  const result = await redis.get(key);
  return result;
}

module.exports = {
  set,
  get,
  helloWorld,
};
