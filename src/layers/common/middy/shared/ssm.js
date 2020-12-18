const aws = require('aws-sdk');
var ssm2 = new aws.SSM();

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
  const params = {
    cache: true,
    cacheExpiryInMillis: 3 * 60 * 60,
    names: {
      STATUS_GROUP_DEFAULT_ID: `/statusGroup/${ENV}/defaultId`
    }
  };

  const request = ssm2.getParameter(params);

  return request;

};

module.exports = { ssmCognito, ssmDefaultStatusGroup };
