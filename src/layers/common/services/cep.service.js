const Invoke = require('../aws/invoke');

const getAddress = async ({ cep, trackCode }) => {
  const event = {
    pathParameters: {
      cep: cep
    },
    queryStringParameters: {
      trackCode: trackCode
    }
  };
  const response = await Invoke.invoke('CepGetFn', event);

  return JSON.parse(response.body);
};

module.exports = { getAddress };
