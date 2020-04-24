const Auth = require('../services/auth');

module.exports = () => {
  return {
    before: async handler => {
      const { event } = handler;
      const token = Auth.parseToken(event.headers['Authorization']);

      const { clientId, clientName, clientSecret } = await Auth.verify(token);

      event.clientSecret = clientSecret;
      event.clientId = clientId;
      event.clientName = clientName;
      return;
    }
  };
};
