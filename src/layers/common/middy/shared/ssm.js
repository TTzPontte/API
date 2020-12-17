const AWS = require('aws-sdk');
const ssmm = AWS.SSM();
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

function ssmDefaultStatusGroup(callback) {
  const params = {
    Name: `/statusGroup/${ENV}/defaultId`
  };
  
  ssm.getParameter(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
    
    callback();
  });
};

module.exports = { ssmCognito, ssmDefaultStatusGroup };
