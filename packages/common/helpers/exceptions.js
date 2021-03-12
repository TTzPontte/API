const createError = require('http-errors');

const exceptionsCalculator = async response => {
  if (response.statusCode) {
    throw new createError.BadRequest(
      "Sorry, we had a problem with one of our services but don't worry because we are already working to solve this problem as fast as possible."
    );
  }
};

module.exports = { exceptionsCalculator };
