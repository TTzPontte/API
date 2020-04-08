const { getNowDefaultDate, getDateIsoString } = require('../helpers/date');
const createError = require('http-errors');
const SimulationModel = require('../models/simulation');
const { getClientSimulation } = require('../elasticsearch/simulations.es');

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
    clientId,
    clientName,
    cpf
  },
  calculated: { netLoan, grossLoan, installment, ltv, ltvMax, cet }
}) => {
  const lastInstallment = installment[installment.length - 1].installment;
  const firstInstallment = installment[0].installment;

  const simulation = new SimulationModel({
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
      campaign: clientName,
      source: clientName,
      skipMonth: skipMonth,
      cpf: cpf,
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
    ltv: [[ltv]],
    ltvMax: [[ltvMax]],
    cet: [[cet]],
    date: getDateIsoString(),
    clientApiId: clientId
  });

  return await simulation.save();
};

const isRegistered = async ({ cpf, email, clientId }) => {
  const simulations = await getClientSimulation({ cpf, email, clientId });

  if (simulations && simulations.length) {
    throw new createError.BadRequest('Cliente já cadastrado');
  }
  return false;
};

module.exports = { save, isRegistered };
