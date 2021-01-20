const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { validate } = require('./validator');
const Simulation = require(`${path}/services/simulation.service`);
const Contract = require(`${path}/services/contract.service`);
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const { success } = require(`${path}/lambda/response`);
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  const { body, clientId } = event;
  const { proposal_id } = body.order;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const lastContract = await Simulation.getLastContract(proposal_id);

  // const contract = await Contract.save({ ...translatedBody, clientId, lastContract });

  // return success({ ...contract });
  return success({ proposal_id });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
