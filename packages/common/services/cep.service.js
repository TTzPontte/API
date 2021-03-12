const Invoke = require('../aws/invoke');
const createError = require('http-errors');

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

const isValidCep = ({ status }) => {
  if (status === 'OK' || status === 'NOK') {
    return true;
  }
  throw new createError.BadRequest('Invalid CEP');
};

const isCovered = ({ status }) => {
  if (status === 'OK') {
    return true;
  }
  return false;
};

module.exports = { getAddress, isValidCep, isCovered };
