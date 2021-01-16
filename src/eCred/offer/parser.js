const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { trackCode } = require(`${path}/helpers/trackCode`);
const { LOAN_MOTIVATION } = require('./constants');

const parser = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [], loanValue, terms } = body;
  const { age, documentNumber, phone, email, income, address } = body.entity;
  const { value } = income[0];
  const { propertyValue } = body.property;
  const sourceIp = requestContext.identity.sourceIp;
  const trackingCode = (await trackCode()) + `:${clientName}`;
  const motivation = loanMotivation.map(motivationItem => {
    return LOAN_MOTIVATION[motivationItem];
  });

  return {
    loanValue: loanValue,
    gracePeriod,
    age,
    email,
    terms,
    phone,
    cep: address.cep,
    documentNumber,
    loanMotivation: motivation,
    skipMonth,
    sourceIp,
    trackCode: trackingCode,
    clientName,
    clientId,
    propertyValue: propertyValue,
    monthlyIncome: value
  };
};

const parserResponseOfferSimulation = ({ simulationId, calculated }) => {
  return [
    {
      offerId: simulationId,
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
};

module.exports = { parser, parserResponseOfferSimulation };
