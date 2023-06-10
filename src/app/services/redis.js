const redis = require('../config/redis');

/** 
 * @param {number} id
 * @param {Map<string, number>} sequenceWithProbs
 */
async function addCondition(id, sequencesWithProbs) {
  // TODO(luatil): Deal with failures
  const sadd = ['sadd', `condition:${id}:sequence`].concat(
    Array.from(sequencesWithProbs.keys()));
  const saddResult = await redis.execute(sadd);

  const hset = ['hset', `condition:${id}:probs`]
    .concat(Array.from(sequencesWithProbs.entries()).flat());
  const hsetResult = await redis.execute(hset);

  return [saddResult, hsetResult];
}

/**
 * @param {number} id
 * @param {string[]} sequences
 */
async function addUser(id, sequences) {
  const sadd = ['sadd', `user:${id}:sequences`].concat(
    sequences);
  const saddResult = await redis.execute(sadd);
  return saddResult;
}

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
  addCondition,
  addUser
};
