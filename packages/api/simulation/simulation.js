const { validate } = require('./validator');
const { parser } = require('./parser');
const { created, badRequest } = require('common/lambda/response');
const { getSiteUrl } = require('common/helpers/url');
const Simulation = require('common/services/simulation.service');
const Calculator = require('common/services/calculator.service');
const Contract = require('common/services/contract.service');
const middy = require('common/middy/middy');
const translateBody = require('./translate');
const { ssmCognito } = require('common/middy/shared/ssm');

const simulation = async event => {
  const data = await parser(event);
  await validate(data);

  await Simulation.isRegistered(data);
  await Contract.isRegistered(data);

  const calculated = await Calculator.calculate(data);

  if (calculated.netLoan) {
      const translatedData = translateBody(data);
      const simulation = await Simulation.save({ data: translatedData, calculated });

      const response = {
        id: simulation.id,
        registrationUrl: `${getSiteUrl()}/cadastro/${simulation.id}`,
        simulation: calculated
      };

      return created({ ...response });
  }

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(simulation).use(ssmCognito()), simulation };
