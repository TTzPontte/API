const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { validate } = require('./validator');
const middy = require(`${path}/middy/middy`);
const { success } = require(`${path}/lambda/response`);
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  const { body, clientId } = event;
  const { proposal_id } = body.order;

  await validate({ ...body, clientId });

  return success({ proposal_id });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
