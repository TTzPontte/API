const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const { validate } = require('./validator');
const Contract = require(`${path}/services/contract.service`);
const Simulation = require(`${path}/services/simulation.service`);
const { success } = require(`${path}/lambda/response`);
const middy = require(`${path}/middy/middy`);
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  const Cognito = require(`${path}/services/cognito.service`);

  const { body, clientId } = event;
  const { simulationId, people } = body;

  const { email, phone, cpf } = people;

  await validate({ ...body, clientId });

  const lastSimulation = await Simulation.getLastSimulation(simulationId);

  await Cognito.createUser({ ...lastSimulation, email, phone, cpf, simulationId });

  const contract = await Contract.save({ ...body, clientId, lastSimulation });

  return success({ ...contract });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
