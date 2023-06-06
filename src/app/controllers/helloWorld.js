const env = require('../config/env');
const helloWorld = require('../services/helloWorld');

function sayHello(req, res, next) {
  res.status(200);
  res.json({ message: 'Hello, World!' });
  return res;
}

function sayHelloWithEnv(req, res, next) {
  res.status(200);
  res.json({ message: `Hello, World! We're on version ${env.app.version} of ${env.app.name}!` });
  return res;
}

function sayHelloWithName(req, res, next) {
  const { name } = req.params;
  res.status(200);
  res.json({ message: `Hello, ${name}!` });
  return res;
}

async function sayHelloToAllInPostgres(req, res, next) {
  try {
    const helloWorlds = await helloWorld.getAll();
    res.status(200);
    res.json({ messages: helloWorlds });
  } catch (err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

module.exports = {
  sayHello,
  sayHelloWithEnv,
  sayHelloWithName,
  sayHelloToAllInPostgres,
};
