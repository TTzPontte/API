const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { parser } = require('./parser');
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

const offer = async event => {
  const { body, clientId } = event;
  const offerParsed = await parser(event);
  const { documentNumber, email } = body.entity;
  await validate(body);

  const address = await getAddress({ ...body.entity.address, ...body });

  if (isValidCep(address)) {
    await Simulation.isRegistered({ documentNumber, email, clientId });
    await Contract.isRegistered({ documentNumber, email });
    const calculated = await Calculator.calculate(body);

    if (calculated.netLoan) {
      if (isCovered(address)) {
        const simulation = await Simulation.save({ data: offerParsed, calculated });
        const lastContract = await Simulation.getLastContract(simulation.id);
        const translatedBody = translateBody(body);
        await Offer.save({ ...translatedBody, clientId, lastContract });

        const response = [
          {
            offerId: simulation.id,
            totalEffectiveCostPercentMonthly: calculated.cet * 100,
            totalEffectiveCostPercentAnnually: calculated.cet * 1200,
            taxRatePercentMonthly: 1.23,
            taxRatePercentAnnually: 14.76,
            taxCreditOperationPercent: calculated.iof,
            installments: calculated.terms,
            value: calculated.netLoan,
            installmentsValue: calculated.installment[0].installment,
            totalPayable: calculated.grossLoan,
            feeCreditOpening: calculated.registry_value
          }
        ];

        return created(response);
      } else {
        await Subscribe.save({ offerParsed, calculated });
        return badRequest('Region not supported');
      }
    }
  }

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(offer).use(ssmCognito()), offer };
