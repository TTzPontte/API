const { ssm } = require('middy/middlewares');
const { ENV } = process.env;

const ssmCognito = () => {
  const prefix = `/cognito/${ENV}/`;

  return ssm({
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 60,
    names: {
      COGNITO_USER_POOL_ID: `${prefix}user_pool_id`,
      COGNITO_REGION: `${prefix}region`
    }
  });
};

const ssmDefaultStatusGroup = () => {
  return await ssm.getParameters({
    Names: [`/my-app/staging/userName`]
  }).promise();
};

module.exports = { ssmCognito, ssmDefaultStatusGroup };
