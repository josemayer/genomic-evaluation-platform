const jwt = require('jsonwebtoken');
const env = require('../config/env');

function decodeToken(auth_header) {
  const token = getBearerToken(auth_header);

  try {
    const decoded = jwt.verify(token, env.app.jwtSecret);
    return decoded;
  } catch (error) {
    throw { status: 401, message: 'Invalid token' };
  }
}

function getBearerToken(auth_header) {
  return auth_header.replace('Bearer ', '');
}

function createToken(userData) {
  return jwt.sign({ userData }, env.app.jwtSecret, { expiresIn: '1h' });
}

module.exports = {
  decodeToken,
  createToken,
};
