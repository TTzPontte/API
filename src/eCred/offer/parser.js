const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { trackCode } = require(`${path}/helpers/trackCode`);
const { monthToYear } = require(`${path}/helpers/rate`);
const { LOAN_MOTIVATION } = require('./constants');

const parser = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [], loanValue, terms } = body;
  const { age, documentNumber, phone, email, income, address } = body.entity;
  const { value } = income;
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
      proposal_id: simulationId,
      total_effective_cost_percent_monthly: calculated.cet * 100,
      total_effective_cost_percent_annually: monthToYear(calculated.cet) * 100,
      tax_rate_percent_monthly: calculated.interest_rate * 100,
      tax_rate_percent_annually: monthToYear(calculated.interest_rate) * 100,
      tax_credit_operation_percent: calculated.iof,
      installments: calculated.terms,
      value: calculated.netLoan,
      installments_value: calculated.installment[0].installment,
      total_payable: calculated.grossLoan,
      fee_credit_opening: calculated.registry_value
    }
  ];
};

module.exports = { parser, parserResponseOfferSimulation };
