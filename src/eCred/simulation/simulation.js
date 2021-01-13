const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { parser } = require('./parser');
const { validate } = require('./validator');
const { created, badRequest } = require(`${path}/lambda/response`);
const { getSiteUrl } = require(`${path}/helpers/url`);
const Simulation = require(`${path}/services/simulation.service`);
const Subscribe = require(`${path}/services/subscribeCep.service`);
const Calculator = require(`${path}/services/calculator.service`);
const Contract = require(`${path}/services/contract.service`);
const { getAddress, isValidCep, isCovered } = require(`${path}/services/cep.service`);
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');

const simulation = async event => {
  const data = await parser(event);
  const { cpf, email } = data.consumer;
  const { clientId } = data;
  await validate(data);

  const address = await getAddress({ ...data.consumer.address, ...data });

  if (isValidCep(address)) {
    await Simulation.isRegistered({ documentNumber: cpf, email, clientId });
    await Contract.isRegistered({ documentNumber: cpf, email });
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

module.exports = { handler: middy(simulation), simulation };
