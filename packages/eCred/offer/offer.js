const { parserOfferSimulation, parserResponseOfferSimulation, parserBody } = require('./parser');
const { validate } = require('./validator');
const { created, success } = require('common/lambda/response');
const Simulation = require('common/services/simulation.service');
const Offer = require('common/services/offer.service');
const Subscribe = require('common/services/subscribeCep.service');
const Calculator = require('common/services/calculator.service');
const Contract = require('common/services/contract.service');
const { getAddress, isValidCep, isCovered } = require('common/services/cep.service');
const middyNoAuth = require('common/middy/middyNoAuth');
const { ssmGroup } = require('common/middy/shared/ssm');
const AuditLog = require('common/lambda/auditLog');

const offer = async (event, context) => {
  const { body, clientId } = event;
  const offerParsed = await parserOfferSimulation(event);
  const { documentNumber } = offerParsed;
  await validate({ ...body, ...offerParsed });

  const address = await getAddress({ ...offerParsed });

  if (isValidCep(address)) {
    const calculated = await Calculator.calculate(offerParsed);

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
        return success('');
      }
    }
  }

  await AuditLog.log(event, context, 'ecred', 'offer', body);

  return success('');
};

module.exports = { handler: middyNoAuth(offer).use(ssmGroup()), offer };
