const { Entity, Schema } = require('redis-om');

class redisUser extends Entity { }

const redisUserSchema = new Schema(redisUser, {
  id: { type: 'number' },
  genetic_codes: { type: 'string[]' }
});

class redisCondition extends Entity { }

const redisConditionSchema = new Schema(redisCondition, {
  id: { type: 'number' },
  probabilityInPopulation: { type: 'number' },
  sequences: { type: 'string[]' }
});


class redisSequenceProbs extends Entity { }

const redisSequenceProbsSchema = new Schema(redisSequenceProbs, {
  conditionId: { type: 'number' },
  sequence: { type: 'string' },
  probabilityInPopulation: { type: 'number' },
  probabilityGivenCondition: { type: 'number' }
});

module.exports = {
  redisUserSchema,
  redisConditionSchema,
  redisSequenceProbsSchema
};
