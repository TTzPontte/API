const createError = require('http-errors');

const defaultMessage =
  "Sorry, we had a problem with one of our services but don't worry because we are already working to solve this problem as fast as possible.";

const exceptionsCalculator = async ({ statusCode, error = {} } = {}) => {
  if (statusCode) {
    throw new createError.BadRequest(`${error.code} ${error.message || defaultMessage}`);
  }
};

module.exports = { exceptionsCalculator };
