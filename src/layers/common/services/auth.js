const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Clients = require('../models/clients');

const parseToken = token => {
  if (!token) throw new createError.Unauthorized();
  return token.replace('Bearer ', '');
};

const verify = async token => {
  try {
    const { clientId } = await jwt.decode(token);
    const { clientSecret, clientName } = await Clients.queryOne({ clientId }).exec();
    await jwt.verify(token, clientSecret);

    return { clientId, clientName, clientSecret };
  } catch {
    throw new createError.Unauthorized();
  }
};

module.exports = { verify, parseToken };
