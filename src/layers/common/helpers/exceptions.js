const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { badRequest } = require(`${path}/lambda/response`);

const exceptionsCalculator = async response => {
  if (response.statusCode) {
    return badRequest(
      "Sorry, we had a problem with one of our services but don't worry because we are already working to solve this problem as fast as possible."
    );
  }
};

module.exports = { exceptionsCalculator };
