// @ts-check
const redis = require('../services/redis');
const express = require('express');

/**
  * @param {express.Request<{id: string, sequences: string}>} req
  * @param {express.Response} res
  */
async function addCondition(req, res) {

  const { id, sequences } = req.params;

  const num = parseInt(id);

  if (isNaN(num)) {
    res.status(400);
    res.json({ message: `${id} should be a number - the condition id` });
    return res;
  }

  /** @type {Map<string, number>} */
  const sequencesWithProbs = new Map();

  // TODO(luatil): Do validation here
  sequences.split("-").forEach((el) => {
    const [seq, prob] = el.split(":");
    sequencesWithProbs.set(seq, parseFloat(prob));
  });

  res.status(200);
  const redisServiceResult = await redis.addCondition(num, sequencesWithProbs);
  res.json({ message: redisServiceResult });
  return res;
}

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
  helloWorldFromRedis,
  addCondition,
}
