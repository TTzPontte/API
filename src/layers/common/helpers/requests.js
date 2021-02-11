const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const fetch = require('node-fetch');
const { ECRED_DOMAIN, PARTNER_KEY_ECRED, ECRED_USER, ECRED_PASSWD } = process.env;
const { basicToken } = require(`${path}/helpers/makeTokens`);

const getHeaders = (typeAuth, token) => ({
  Authorization: `${typeAuth} ${token}`,
  Accept: 'application/json',
  'Content-Type': 'application/json'
});

const postEcredStatusContractUpdated = async body => {
  const token = basicToken(ECRED_USER, ECRED_PASSWD);
  const headers = getHeaders('Basic', token);
  const url = `${ECRED_DOMAIN}/ecred-integration/v1/order/status/${PARTNER_KEY_ECRED}`;
  console.log('url -> ', url);
  console.log('user and passwd -> ', `${ECRED_USER} - ${ECRED_PASSWD}`);
  const response = await fetch(url, {
    headers,
    body,
    method: 'POST'
  });

  if (response.ok) {
    return response;
  }

  return response.json();
};

module.exports = { postEcredStatusContractUpdated };
