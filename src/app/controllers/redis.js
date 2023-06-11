// @ts-check
const redis = require('../services/redis');
const express = require('express');
const libdna = require('../lib/libdna');

/**
 * @param {express.Request<{userId: string}>} req
 * @param {express.Response} res
 */
async function findUserConditions(req, res) {

  const { userId } = req.params;

  const num = parseInt(userId);

  if (isNaN(num)) {
    res.status(400);
    res.json({ message: `${userId} should be a number - the user id` });
    return res;
  }

  const redisResult = await redis.findUserConditions(num);

  res.status(200);
  res.json({ message: redisResult });
  return res;
}

async function searchAllUsers(req, res) {
  const result = await redis.searchAllUsers();
  res.status(200);
  res.json({ message: result });
  return res;
}

async function addCondition(req, res) {

  const { id, prob, sequences } = req.params;

  const num = parseInt(id);

  if (isNaN(num)) {
    res.status(400);
    res.json({ message: `${id} should be a number - the condition id` });
    return res;
  }

  const probability = parseFloat(prob);

  if (isNaN(probability)) {
    res.status(400);
    res.json({ message: `${prob} should be a number - the probability` });
    return res;
  }

  const sequenceArray = sequences.split("-").map((el) => el.toUpperCase());
  const sequencesWithProbs = [];

  for (let i = 0; i < sequenceArray.length; i++) {
    let [seq, probInPop, probGivenSeq] = sequenceArray[i].split(":");
    if (!libdna.validateDNA(seq)) {
      res.status(400);
      res.json({ message: `${seq} should be a DNA sequence` });
      return res;
    }

    const parsedProbInPop = parseFloat(probInPop);
    const parsedProbGivenSeq = parseFloat(probGivenSeq);

    if (isNaN(parsedProbInPop)) {
      res.status(400);
      res.json({ message: `${probInPop} should be a number - the probability in population` });
      return res;
    }
    if (isNaN(parsedProbGivenSeq)) {
      res.status(400);
      res.json({ message: `${probGivenSeq} should be a number - the probability given sequence` });
      return res;
    }
    if(parsedProbInPop > 1 || parsedProbInPop < 0) {
      res.status(400);
      res.json({ message: `${probInPop} should be a number between 0 and 1 - the probability in population` });
      return res;
    }
    if(parsedProbGivenSeq > 1 || parsedProbGivenSeq < 0) {
      res.status(400);
      res.json({ message: `${probGivenSeq} should be a number between 0 and 1 - the probability given sequence` });
      return res;
    }
    sequencesWithProbs.push({
      sequence: seq,
      probabilityInPopulation: parsedProbInPop,
      probabilityGivenSequence: parsedProbGivenSeq
    });
  }

  const redisServiceResult = await redis.addCondition(num, probability, sequencesWithProbs);
  res.status(200);
  res.json({ message: redisServiceResult });
  return res;
}

/**
 * @param {express.Request<{id: string, sequences: string}>} req
 * @param {express.Response} res
 */
async function addUser(req, res) {

  const { id, sequences } = req.params;

  const num = parseInt(id);

  if (isNaN(num)) {
    res.status(400);
    res.json({ message: `${id} should be a number - the user id` });
    return res;
  }

  // TODO(luatil): Do validation here
  const sequenceArray = sequences.split("-").map((el) => el.toUpperCase());

  for (let i = 0; i < sequenceArray.length; i++) {
    if (!libdna.validateDNA(sequenceArray[i])) {
      res.status(400);
      res.json({ message: `${sequenceArray[i]} is not a valid sequence` });
      return res;
    }
  }

  res.status(200);
  const redisServiceResult = await redis.addUser(num, sequenceArray);
  res.json({ message: redisServiceResult });
  return res;
}

module.exports = {
  addUser,
  addCondition,
  searchAllUsers,
  findUserConditions,
};
