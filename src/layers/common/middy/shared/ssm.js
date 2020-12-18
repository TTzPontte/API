const aws = require('aws-sdk');

aws.config.update({
  region: 'us-east-1'
})

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

const parameterStore = new aws.SSM()

const getParam = param => {
  return new Promise((res, rej) => {
    parameterStore.getParameter({
      Name: param
    }, (err, data) => {
        if (err) {
          return rej(err)
        }
        return res(data)
    });
  });
};

const ssmDefaultStatusGroup = async () => {
  const param = await getParam(`/statusGroup/${ENV}/defaultId`)
  return {
    statusCode: 200,
    body: JSON.stringify(param)
  };
};

module.exports = { ssmCognito, ssmDefaultStatusGroup };
