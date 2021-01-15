const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { trackCode } = require(`${path}/helpers/trackCode`);
const { LOAN_MOTIVATION } = require('./constants');

const parserSimulation = data => {
  const motivation = data.loanMotivation.map(motivationItem => {
    return LOAN_MOTIVATION[motivationItem];
  });

  const translated = {
    loanValue: data.loanValue,
    propertyValue: data.property.propertyValue,
    monthlyIncome: data.entity.income[0].value,
    loanMotivation: data.loanMotivation,
    age: data.entity.age,
    documentNumber: data.entity.documentNumber,
    phone: data.entity.phone,
    cep: data.entity.address.cep,
    terms: data.terms,
    email: data.entity.email
  };

  return { ...translated, loanMotivation: motivation };
};

const parser = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [] } = body;
  const { value } = body.entity.income[0];
  const { propertyValue } = body.property;
  const sourceIp = requestContext.identity.sourceIp;
  const trackingCode = (await trackCode()) + `:${clientName}`;

  return {
    ...body,
    gracePeriod,
    loanMotivation,
    skipMonth,
    sourceIp,
    trackCode: trackingCode,
    clientName,
    clientId,
    propertyValue: propertyValue,
    monthlyIncome: value
  };
};

module.exports = { parser, parserSimulation };
