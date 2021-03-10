const createError = require('http-errors');
const Clients = require('../models/clients');

module.exports = () => {
  return {
    before: async handler => {
      try {
        const { event } = handler;
        const { Authorization: authHeader } = event.headers;

        const [clientId, pass] = Buffer.from(authHeader.replace(/basic/, '').replace(/ /g, ''), 'base64')
          .toString()
          .split(':');
        const { clientName, clientSecret } = await Clients.queryOne({ clientId }).exec();
        if (clientSecret !== pass) throw new createError.Unauthorized();

        event.clientSecret = clientSecret;
        event.clientId = clientId;
        event.clientName = clientName;
        return;
      } catch {
        throw new createError.Unauthorized();
      }
    }
  };
};
