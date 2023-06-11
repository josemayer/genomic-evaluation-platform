const { Client } = require('redis-om');
const env = require('./env');
const url = env.dbs.redis.url;
const client = new Client();

module.exports = {
    client,
    url
};
