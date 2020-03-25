const { getNowDefaultDate, getDateIsoString } = require('../helpers/date');
const Simulation = require('../models/simulation');

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
    sourceIp,
    clientId
  },
  calculated: { netLoan, grossLoan, installment, ltv, ltvMax, cet }
}) => {
  const lastInstallment = installment[installment.length - 1].installment;
  const firstInstallment = installment[0].installment;

  const simulation = new Simulation({
    valorImovel: propertyValue,
    loanMotivation: loanMotivation,
    cep: cep,
    idade: age,
    parametros: {
      valorEmprestimo: loanValue,
      valImovel: propertyValue,
      rendaMensal: monthlyIncome,
      idade: age,
      cep: cep,
      email: email,
      phone: phone,
      trackCode: trackCode,
      gracePeriod: gracePeriod,
      skipMonth: skipMonth,
      loanDate: getNowDefaultDate()
    },
    accepted: {
      ip: sourceIp,
      time: getDateIsoString(),
      check: true
    },
    prazos: [terms],
    valoresEmprestimo: [netLoan],
    valoresEmprestimeBruto: [grossLoan],
    parcelas: [[firstInstallment]],
    ultimaParcela: [[lastInstallment]],
    lvt: [[ltv]],
    ltvMax: [[ltvMax]],
    cet: [[cet]],
    date: getDateIsoString(),
    status: 'PENDING',
    clientApiId: clientId
  });

  return await simulation.save();
};

module.exports = { save };
