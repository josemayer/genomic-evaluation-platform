const redis = require('../services/redis');

async function helloWorldFromRedis(req, res, next) {
  res.status(200);
  const redisResult = await redis.helloWorld();
  res.json({ message: redisResult });
  return res;
}

async function setKeyWithValue(req, res, next) {
  // NOTE(luatil): This should probably be a POST message
  const { key, value } = req.params;
  res.status(200);
  const redisSetResult = await redis.set(key, value);
  res.json({ message: redisSetResult });
  return res;
}

async function getValue(req, res, next) {
  const { key } = req.params;
  res.status(200);
  const value = await redis.get(key);
  res.json({ message: value });
  return res;
}

async function addUser(req, res, next) {
}

module.exports = {
  setKeyWithValue,
  getValue,
  helloWorldFromRedis
}
