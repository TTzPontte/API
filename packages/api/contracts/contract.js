const { validate } = require('./validator');
const Contract = require('common/services/contract.service');
const Simulation = require('common/services/simulation.service');
const { success } = require('common/lambda/response');
const middy = require('common/middy/middy');
const translateBody = require('./translate');
const { ssmCognito } = require('common/middy/shared/ssm');

const contract = async event => {
  const { body, clientId } = event;
  const { simulationId } = body;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const lastContract = await Simulation.getLastContract(simulationId);

  const contract = await Contract.save({ ...translatedBody, clientId, lastContract });

  return success({ ...contract });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
