const redis = require('../config/redis');

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
  get
};
