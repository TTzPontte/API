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
  const data = await parser(event);
  const { documentNumber, email } = data.entity;
  const { clientId } = data;
  await validate(data);

  const address = await getAddress({ ...data.entity.address, ...data });

  if (isValidCep(address)) {
    await Simulation.isRegistered({ documentNumber, email, clientId });
    await Contract.isRegistered({ documentNumber, email });
    const calculated = await Calculator.calculate(data);

    if (calculated.netLoan) {
      if (isCovered(address)) {
        const translatedData = translateBody(data);
        console.log('translatedData -> ', translatedData);
        const simulation = await Simulation.save({ data: translatedData, calculated });
        const lastContract = await Simulation.getLastContract(simulation.id);
        await Offer.save({ ...translatedData, clientId, lastContract });

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
        await Subscribe.save({ data, calculated });
        return badRequest('Region not supported');
      }
    }
  }

  return badRequest('Algo deu errado.');
};

module.exports = { handler: middy(offer).use(ssmCognito()), offer };
