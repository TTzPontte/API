const Auth = require('../services/auth');

module.exports = () => {
  return {
    before: async (handler, next) => {
      const { event } = handler;
      const token = Auth.parseToken(event.headers['Authorization']);

      const { body, clientId, clientName } = await Auth.verify(token);
      event.body = { ...body };
      event.clientId = clientId;
      event.clientName = clientName;
      return;
    }
  };
};
