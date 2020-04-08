const SubscribeCepModel = require('../models/subscribeCep');

const save = async ({
  data: {
    loanValue,
    propertyValue,
    monthlyIncome,
    terms,
    age,
    cep,
    email,
    phone,
    trackCode,
    loanMotivation,
    gracePeriod,
    skipMonth,
    clientId,
    clientName,
    cpf
  },
  calculated: { netLoan, grossLoan, installment, ltv, ltvMax, cet }
}) => {
  const lastInstallment = installment[installment.length - 1].installment;
  const firstInstallment = installment[0].installment;

  const subscribeCep = new SubscribeCepModel({
    propertyValue,
    loanMotivation,
    cep,
    age,
    loanValue,
    monthlyIncome,
    email,
    phone,
    trackCode,
    gracePeriod,
    source: clientName,
    skipMonth,
    cpf,
    terms,
    netLoan,
    grossLoan,
    installment: firstInstallment,
    lastInstallment,
    ltv,
    ltvMax,
    cet,
    clientApiId: clientId
  });

  return await subscribeCep.save();
};

module.exports = { save };
