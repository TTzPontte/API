const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const { validate } = require('./validator');
const { parser } = require('./parser');
const { success, badRequest } = require(`${path}/lambda/response`);
const { getSiteUrl } = require(`${path}/helpers/url`);
const Simulation = require(`${path}/services/simulation.service`);
const Subscribe = require(`${path}/services/subscribeCep.service`);
const Calculator = require(`${path}/services/calculator.service`);
const Contract = require(`${path}/services/contract.service`);
const { getAddress, isValidCep, isCovered } = require(`${path}/services/cep.service`);
const middy = require(`${path}/middy/middy`);

const simulation = async event => {
  const data = await parser(event);
  await validate(data);

  const address = await getAddress(data);

  if (isValidCep(address)) {
    await Simulation.isRegistered(data);
    await Contract.isRegistered(data);

    const calculated = await Calculator.calculate(data);

    if (calculated.netLoan) {
      if (isCovered(address)) {
        const simulation = await Simulation.save({ data, calculated });

        const response = {
          id: simulation.id,
          registrationUrl: `${getSiteUrl()}/cadastro/${simulation.id}`,
          simulation: calculated
        };

        return success({ ...response });
      } else {
        await Subscribe.save({ data, calculated });
        return badRequest('Região não atendida');
      }
    }
  }

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(simulation), simulation };
