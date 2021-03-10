const { validate } = require('./validator');
const { parser } = require('./parser');
const { created, badRequest } = require('common/lambda/response');
const { getSiteUrl } = require('common/helpers/url');
const Simulation = require('common/services/simulation.service');
const Subscribe = require('common/services/subscribeCep.service');
const Calculator = require('common/services/calculator.service');
const Contract = require('common/services/contract.service');
const { getAddress, isValidCep, isCovered } = require('common/services/cep.service');
const middy = require('common/middy/middy');
const translateBody = require('./translate');
const { ssmCognito } = require('common/middy/shared/ssm');

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
        const translatedData = translateBody(data);
        const simulation = await Simulation.save({ data: translatedData, calculated });

        const response = {
          id: simulation.id,
          registrationUrl: `${getSiteUrl()}/cadastro/${simulation.id}`,
          simulation: calculated
        };

        return created({ ...response });
      } else {
        await Subscribe.save({ data, calculated });
        return badRequest('Region not supported');
      }
    }
  }

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(simulation).use(ssmCognito()), simulation };
