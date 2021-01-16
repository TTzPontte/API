const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { parser, parserResponseOfferSimulation } = require('./parser');
const { validate } = require('./validator');
const { created, badRequest } = require(`${path}/lambda/response`);
const Simulation = require(`${path}/services/simulation.service`);
const Offer = require(`${path}/services/offer.service`);
const Subscribe = require(`${path}/services/subscribeCep.service`);
const Calculator = require(`${path}/services/calculator.service`);
const Contract = require(`${path}/services/contract.service`);
const { getAddress, isValidCep, isCovered } = require(`${path}/services/cep.service`);
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const { ssmCognito } = require(`${path}/middy/shared/ssm`);
const AuditLog = require(`${path}/lambda/auditLog`);

const offer = async (event, context) => {
  const { body, clientId } = event;
  const offerParsed = await parser(event);
  const { documentNumber, email } = body.entity;
  await validate(body);

  const address = await getAddress({ ...offerParsed });

  if (isValidCep(address)) {
    await Simulation.isRegistered({ documentNumber, email, clientId });
    await Contract.isRegistered({ documentNumber, email });
    const calculated = await Calculator.calculate(offerParsed);

    if (calculated.netLoan) {
      if (isCovered(address)) {
        const simulation = await Simulation.save({ data: offerParsed, calculated });
        const lastContract = await Simulation.getLastContract(simulation.id);
        const translatedBody = translateBody(body);
        await Offer.save({ ...translatedBody, clientId, lastContract });

        const response = parserResponseOfferSimulation({ simulationId: simulation.id, calculated });

        await AuditLog.log(event, context, 'ecred', 'offer', JSON.parse(body));

        return created(response);
      } else {
        await Subscribe.save({ offerParsed, calculated });
        await AuditLog.log(event, context, 'ecred', 'offer', JSON.parse(offerParsed));
        return badRequest('Region not supported');
      }
    }
  }

  await AuditLog.log(event, context, 'ecred', 'offer', JSON.parse(body));

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(offer).use(ssmCognito()), offer };
