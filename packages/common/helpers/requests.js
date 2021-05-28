const requestify = require('requestify');
const { basicToken } = require('./makeTokens');

const getHeaders = (typeAuth, token) => ({
  Authorization: `${typeAuth} ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/json'
});

const postEcredStatusContractUpdated = async body => {
  const { ECRED_DOMAIN, PARTNER_KEY_ECRED, ECRED_USER, ECRED_PASSWD } = process.env;
  const token = basicToken(ECRED_USER, ECRED_PASSWD);
  const headers = getHeaders('Basic', token);
  const url = `${ECRED_DOMAIN}/ecred-integration/v1/order/status/${PARTNER_KEY_ECRED}`;

  return requestify.request(url, {
    headers,
    body,
    method: 'POST',
    dataType: 'json'
  });
};

module.exports = { postEcredStatusContractUpdated };
