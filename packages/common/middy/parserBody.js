const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = () => {
  return {
    before: async handler => {
      const { event } = handler;
      const { body, clientSecret } = event;
      const { payload } = JSON.parse(body);

      if (!payload) throw new createError.Unauthorized();

      try {
        const body = await jwt.verify(payload, clientSecret);
        event.body = { ...body };
      } catch (err) {
        throw new createError.Unauthorized();
      }
      return;
    }
  };
};
