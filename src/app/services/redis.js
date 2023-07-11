const { client, url } = require('../config/redis');
const { redisUserSchema, redisConditionSchema, redisSequenceProbsSchema } = require('../../dbs/redis/schema/1-redisSchemas');

/**
 * @param id
 * @param probability
 * @param {{sequence: string, probabilityInPopulation: number, probabilityGivenSequence: number}[]} sequencesWithProbs
 */
async function addCondition(id, probability, sequencesWithProbs) {
  await client.open(url);
  const conditionRepository = client.fetchRepository(redisConditionSchema);
  await conditionRepository.createIndex();

  let result = 'Failed';
  const search = await conditionRepository.search().where('id').equals(id).returnFirst();
  if (search) {
    result = `Condition with id ${id} already exists`;
  } else {
    result = {};
    result['condition'] = await conditionRepository.createAndSave({ id: id, probabilityInPopulation: parseFloat(probability), sequences: sequencesWithProbs.map((el) => el.sequence) });
    result['sequenceProbs'] = [];
    const sequenceProbsRepository = client.fetchRepository(redisSequenceProbsSchema);
    await sequenceProbsRepository.createIndex();
    for (let i = 0; i < sequencesWithProbs.length; i++) {
      const tmp = await sequenceProbsRepository.createAndSave({
        conditionId: id,
        sequence: sequencesWithProbs[i].sequence,
        probabilityInPopulation: parseFloat(sequencesWithProbs[i].probabilityInPopulation),
        probabilityGivenCondition: parseFloat(sequencesWithProbs[i].probabilityGivenSequence)
      });
      result['sequenceProbs'].push(tmp);
    }
  }

  await client.close();
  return result;
}

/**
 * @param {number} id
 * @param {number[]} sequences
 * @returns {Promise<any>}
 */
async function addGenesToUser(id, sequences) {
  await client.open(url);
  const userRepository = client.fetchRepository(redisUserSchema);
  await userRepository.createIndex();

  let result;
  const search = await userRepository.search().where('id').equals(id).returnFirst();
  if (search) {
    const codes = search.genetic_codes;
    search.genetic_codes = Array.from(new Set(codes.concat(sequences)));

    result = await userRepository.save(search);
  } else {
    result = await userRepository.createAndSave({ id: id, genetic_codes: sequences });
  }

  await client.close();
  return result;
}

async function searchAllUsers() {
  await client.open(url);
  const userRepository = client.fetchRepository(redisUserSchema);
  await userRepository.createIndex();
  const users = await userRepository.search().returnAll();
  await client.close();
  return users;
}

async function findUserConditions(userId) {
  await client.open(url);
  const userRepository = client.fetchRepository(redisUserSchema);
  await userRepository.createIndex();

  const user = await userRepository.search().where('id').equals(userId).returnFirst();

  let result = 'Failed';
  if (user) {
    const conditionRepository = client.fetchRepository(redisConditionSchema);
    await conditionRepository.createIndex();
    const allConditions = await conditionRepository.search().returnAll();

    const sequenceProbsRepository = client.fetchRepository(redisSequenceProbsSchema);
    await sequenceProbsRepository.createIndex();

    const conditions = [];
    for (let i = 0; i < allConditions.length; i++) {

      const condition = allConditions[i];
      let probabilityUserHasCondition = condition.probabilityInPopulation;

      const sequences = condition.sequences;
      const intersect = sequences
        .filter((el) => user.genetic_codes.includes(el));

      for (let i = 0; i < intersect.length; i++) {
        const sequenceProbs = await sequenceProbsRepository
          .search()
          .where('conditionId')
          .equals(condition.id)
          .where('sequence')
          .equals(intersect[i])
          .returnAll();
        // NOTE(luatil): Bayesian update occurs here
        probabilityUserHasCondition = bayesianUpdate(probabilityUserHasCondition, sequenceProbs[0].probabilityInPopulation, sequenceProbs[0].probabilityGivenCondition);
      }
      conditions.push({ id: condition.id, probability: probabilityUserHasCondition });
    }
    result = conditions;
  } else {
    result = `User with id ${userId} does not exist`;
  }

  await client.close();
  return result;
}

function intersectSize(a, b) {
  const u = a.concat(b);
  const s = new Set(u);
  return u.length - s.size;
}

async function findRelated(userId) {
  await client.open(url);
  const userRepository = client.fetchRepository(redisUserSchema);
  await userRepository.createIndex();

  const user = await userRepository.search().where('id').equals(userId).returnFirst();

  if (!user) return [];

  const userHas1000 = user.genetic_codes.length >= 1000;

  if (!userHas1000) return [];

  const allUsers = await userRepository.search().returnAll();

  const matches = [];

  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].id === user.id) continue;
    const has1000 = (allUsers[i].genetic_codes.length >= 1000);
    if (has1000) {
      const matchingCodes = intersectSize(user.genetic_codes, allUsers[i].genetic_codes);
      if (matchingCodes >= 400) {
        matches.push(allUsers[i].id);
      }
    }
  }

  await client.close();
  return matches;
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
  addGenesToUser,
  addCondition,
  searchAllUsers,
  findUserConditions,
  findRelated
};
