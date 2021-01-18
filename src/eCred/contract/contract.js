const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const middy = require(`${path}/middy/middy`);
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  return 'Hello World';
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
