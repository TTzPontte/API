const AWS = require("aws-sdk")
const ssm2 = AWS.SSM();
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
  return ssm2.getParameters({
    Names: [`/statusGroup/${ENV}/defaultId`]
  });
};

module.exports = { ssmCognito, ssmDefaultStatusGroup };
