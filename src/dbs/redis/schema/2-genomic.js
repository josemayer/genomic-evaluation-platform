const { Entity, Schema } = require('redis-om');

class redisUser extends Entity { };

const redisUserSchema = new Schema(redisUser, {
    id: { type: 'number' },
    genetic_codes: { type: 'string[]' }
});

class redisCondition extends Entity { }

const redisConditionSchema = new Schema(redisCondition, {
    id: { type: 'number' },
    name: { type: 'string' },
    condition_prob: { type: 'number' },
});

class redisGeneticSequence extends Entity { }

const redisGeneticSequenceSchema = new Schema(redisGeneticSequence, {
    id: { type: 'number' },
});

module.exports = {
    redisUserSchema,
    redisConditionSchema
};
