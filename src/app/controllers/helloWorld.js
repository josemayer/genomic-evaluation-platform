const env = require('../config/env');
const helloWorld = require('../services/helloWorld');

function sayHello(req, res, next) {
  res.json({ message: 'Hello, World!' });
}

function sayHelloWithEnv(req, res, next) {
  res.json({ message: `Hello, World! We're on version ${env.app.version} of ${env.app.name}!` });
}

function sayHelloWithName(req, res, next) {
  const { name } = req.params;
  res.json({ message: `Hello, ${name}!` });
}

async function sayHelloToAllInPostgres(req, res, next) {
  try {
    const helloWorlds = await helloWorld.getAll();
    res.json({ messages: helloWorlds });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  sayHello,
  sayHelloWithEnv,
  sayHelloWithName,
  sayHelloToAllInPostgres,
};
