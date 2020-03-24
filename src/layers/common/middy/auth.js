const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const Clients = require('../models/clients');

module.exports = () => {
  return {
    before: async (handler, next) => {
      const { event } = handler;
      let token = event.headers['Authorization'];
      if (!token) throw new createError.Unauthorized();
      token = token.slice(7, token.length); // Remove 'Bearer' from string

      try {
        const { clientId, body } = await jwt.decode(token);
        if (!clientId) throw new createError.Unauthorized();
        const { clientSecret, clientName } = await Clients.queryOne({ clientId }).exec();
        await jwt.verify(token, clientSecret);
        event.body = { ...body };
        event.clientId = clientId;
        event.clientName = clientName;

        next();
      } catch {
        throw new createError.Unauthorized();
      }
    }
  };
};
