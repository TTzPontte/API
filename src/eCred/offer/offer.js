const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { parserOfferSimulation, parserResponseOfferSimulation, parserBody } = require('./parser');
const { validate } = require('./validator');
const { created, badRequest } = require(`${path}/lambda/response`);
const { exceptionsCalculator } = require(`${path}/helpers/exceptions`);
const Simulation = require(`${path}/services/simulation.service`);
const Offer = require(`${path}/services/offer.service`);
const Subscribe = require(`${path}/services/subscribeCep.service`);
const Calculator = require(`${path}/services/calculator.service`);
const Contract = require(`${path}/services/contract.service`);
const { getAddress, isValidCep, isCovered } = require(`${path}/services/cep.service`);
const middy = require(`${path}/middy/middy`);
const { ssmGroup } = require(`${path}/middy/shared/ssm`);
const AuditLog = require(`${path}/lambda/auditLog`);

const offer = async (event, context) => {
  const { body, clientId } = event;
  const offerParsed = await parserOfferSimulation(event);
  const { documentNumber } = offerParsed;
  await validate({ ...body, ...offerParsed });

  const address = await getAddress({ ...offerParsed });

  if (isValidCep(address)) {
    await Simulation.isRegisteredByDocNumber({ documentNumber, clientId });
    await Contract.isRegisteredByDocNumber({ documentNumber });
    const calculated = await Calculator.calculate(offerParsed);
    await exceptionsCalculator(calculated);

    if (calculated.netLoan) {
      if (isCovered(address)) {
        const simulation = await Simulation.save({ data: offerParsed, calculated });
        const lastContract = await Simulation.getLastContract(simulation.id);
        const bodyParserd = parserBody({ ...body, ...offerParsed });
        await Offer.save({ ...bodyParserd, clientId, lastContract });

        const response = parserResponseOfferSimulation({ simulationId: simulation.id, calculated });

        await AuditLog.log(event, context, 'ecred', 'offer', body);

        return created(response);
      } else {
        await Subscribe.save({ offerParsed, calculated });
        await AuditLog.log(event, context, 'ecred', 'offer', offerParsed);
        return badRequest('Region not supported');
      }
    }
  }

  await AuditLog.log(event, context, 'ecred', 'offer', body);

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(offer).use(ssmGroup()), offer };
