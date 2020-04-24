const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const { validate } = require('./validator');
const Contract = require(`${path}/services/contract.service`);
const Simulation = require(`${path}/services/simulation.service`);
const { success } = require(`${path}/lambda/response`);
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  const Cognito = require(`${path}/services/cognito.service`);

  const { body, clientId } = event;
  const { simulationId } = body;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const lastSimulation = await Simulation.getLastSimulation(simulationId);

  const contract = await Contract.save({ ...translatedBody, clientId, lastSimulation });

  return success({ ...contract });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
