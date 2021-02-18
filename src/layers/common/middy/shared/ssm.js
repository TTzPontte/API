const { ssm } = require('middy/middlewares');
const { ENV } = process.env;

const ssmCognito = () => {
  const prefix = `/cognito/${ENV}/`;

  return ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 60,
    names: {
      COGNITO_USER_POOL_ID: `${prefix}user_pool_id`,
      COGNITO_REGION: `${prefix}region`,
      STATUS_GROUP_DEFAULT_ID: `/statusGroup/${ENV}/defaultId`
    }
  });
};

const ssmGroup = () => {
  return ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 60,
    names: {
      STATUS_GROUP_DEFAULT_ID: `/statusGroup/${ENV}/defaultId`
    }
  });
};

const ssmPartner = partner => {
  return ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 60,
    names: {
      ECRED_DOMAIN: `/partners/${partner}/${ENV}/domain`,
      PARTNER_KEY_ECRED: `/partners/${partner}/${ENV}/key`,
      ECRED_USER: `/partners/${partner}/${ENV}/user`,
      ECRED_PASSWD: `/partners/${partner}/${ENV}/passwd`
    }
  });
};

module.exports = { ssmCognito, ssmGroup, ssmPartner };
