const { v4: uuid } = require('uuid');

const trackCode = () => {
  return uuid();
};

module.exports = { trackCode };
