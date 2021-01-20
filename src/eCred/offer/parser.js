const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { trackCode } = require(`${path}/helpers/trackCode`);
const { monthToYear } = require(`${path}/helpers/rate`);
const { LOAN_MOTIVATION } = require('./constants');

const parserOfferSimulation = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [], customer, questions } = body;
  const { age, cpf: documentNumber } = customer;
  const { value: loanValue, income, property_value, address_zip_code, installments } = questions;

  const sourceIp = requestContext.identity.sourceIp;
  const trackingCode = (await trackCode()) + `:${clientName}`;
  const motivation = loanMotivation.map(motivationItem => {
    return LOAN_MOTIVATION[motivationItem];
  });

  return {
    loanValue,
    gracePeriod,
    age,
    terms: installments,
    cep: address_zip_code,
    documentNumber,
    loanMotivation: motivation,
    skipMonth,
    sourceIp,
    trackCode: trackingCode,
    clientName,
    clientId,
    propertyValue: property_value,
    monthlyIncome: income
  };
};

const parserBody = async data => {
  const { cep, documentNumber, monthlyIncome, consumer, questions } = data;
  const nickName = consumer.name
    .split(' ')
    .slice(0, -1)
    .join(' ');

  const entity = {
    name: consumer.name,
    nickName: nickName,
    address: {
      cep: cep,
      city: questions.address_city,
      neighborhood: questions.address_neighborhood,
      number: questions.address_number,
      state: questions.address_state.value,
      streetAddress: questions.address
    },
    about: {
      birthdate: consumer.birth_date
    },
    documentNumber: documentNumber,
    income: [
      {
        activity: questions.profession.label,
        value: monthlyIncome,
        source: questions.ocupation.label.toUpperCase()
      }
    ]
  };

  return entity;
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

module.exports = { parserOfferSimulation, parserResponseOfferSimulation, parserBody };
