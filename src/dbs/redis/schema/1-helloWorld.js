const { Entity, Schema } = require('redis-om');

class helloWorld extends Entity { }

const helloWorldSchema = new Schema(helloWorld, {
  name: { type: 'string' },
})

module.exports = {
  helloWorldSchema,
};
