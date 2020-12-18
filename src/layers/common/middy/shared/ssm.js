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

const ssmGetParam = async () => {

}

async function ssmDefaultStatusGroup()
{
   var params = {
       Name: `/statusGroup/${ENV}/defaultId` 
   };
   
   var request = await ssm.getParameter(params).promise();
   
   return request.Parameter.Value;          
}

module.exports = { ssmCognito, ssmDefaultStatusGroup };
