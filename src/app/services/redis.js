// @ts-check
const redis = require('../config/redis');

/** 
 * @param {number} id
 * @param {Map<string, number>} sequencesWithProbs
 */
async function addCondition(id, sequencesWithProbs) {
  // TODO(luatil): Deal with failures

  /** @type {import('../config/redis').redisCommand} */
  const sadd = ['sadd', `condition:${id}:sequence`]
    .concat(Array.from(sequencesWithProbs.keys()));
  const saddResult = await redis.execute(sadd);

  const hset = ['hset', `condition:${id}:probs`]
    // @ts-expect-error (wrong type inference) 
    .concat(Array.from(sequencesWithProbs.entries()).flat());
  const hsetResult = await redis.execute(hset);

  return [saddResult, hsetResult];
}

/**
 * @param {number} id
 * @param {string[]} sequences
 */
async function addUser(id, sequences) {
  /** @type {import('../config/redis').redisCommand} */
  const sadd = ['sadd', `user:${id}:sequences`]
    .concat(sequences);
  const saddResult = await redis.execute(sadd);
  return saddResult;
}

/**
 * @param {number} userId
 */
async function findUserConditions(userId) {
  // TODO(luatil): Get all conditions 
  const conditions = [{ id: 1, probabilityInPopulation: 0.3 }, { id: 2, prob_in_pop: 0.2 }, { id: 3, prob_in_pop: 0.7 }];
  const userKey = `user:${userId}:sequences`;

  /** @type {{ info: any[] }} */
  const result = {
    info: []
  };

  await Promise.all(conditions.map(async (cond) => {

    const info = {};

    let conditionProb = cond.probabilityInPopulation;

    info['conditionProb'] = conditionProb;

    const intersect = await redis.execute(
      ['sinter', userKey, `condition:${cond.id}:sequence`]
    );

    if (intersect.length > 0) {
      info['match'] = (`Condition: ${cond.id} had ${intersect.length} matches`);

      const probsQueryResult = await redis.execute(
        ['hmget', `condition:${cond.id}:probs`]
          .concat(intersect)
      );

      info['probQueryResult'] = probsQueryResult;
      result['info'].push(info);
    }

  }));

  return result;
}

/**
  * P(A|B) = P(A) * P(B|A) / P(B)
  * @param {number} probA
  * @param {number} probB 
  * @param {number} probB_A 
  * @returns {number} - probA_B
  */
function bayesianUpdate(probA, probB, probB_A) {
  return probA * probB_A / probB;
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

// TODO(luatil): Implement the following service
// def find_related(user):
// 	user_key = f”users:{user.id}:codigos”
// 	possibly_related = []
// 	for other in users:
// 		if user == other: return
// 		other_key = f"users:{other.cod}:codigos"
// 		intersec = sinter user_key other_key
// 		indice_de_similaridade = f(intersec) 
// 		if indice_de_similaridade > CONSTANTE_SIMILARIDADE:
// 			possibly_related.append(other)
// 	return possibly_related


module.exports = {
  set,
  get,
  helloWorld,
  addCondition,
  addUser,
  findUserConditions
};
