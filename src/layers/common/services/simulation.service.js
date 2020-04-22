const { getNowDefaultDate, getDateIsoString } = require('../helpers/date');
const Simulation = require('../models/simulation');
const createError = require('http-errors');
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

  return simulation.save();
};

const isRegistered = async ({ cpf, email, clientId }) => {
  const simulations = await getClientSimulation({ cpf, email, clientId });

  if (simulations && simulations.length) {
    throw new createError.Conflict('Customer already exists');
  }
  return false;
};

const getLastSimulation = async simulationId => {
  try {
    const { parametros, id, prazos, parcelas } = await Simulation.queryOne({ id: simulationId }).exec();
    const { idade, cep, email, loanDate, rendaMensal, valImovel, valorEmprestimo, trackCode, campaign, source } = parametros;
    const installments = parcelas[0];
    return {
      id,
      age: idade,
      cep: cep,
      date: loanDate,
      installment: installments[0],
      loanValue: valorEmprestimo,
      loanValueSelected: valorEmprestimo,
      propertyValue: valImovel,
      rendaMensal: rendaMensal,
      term: prazos[0],
      email: email,
      trackCode,
      campaign,
      source
    };
  } catch (error) {
    throw new createError.NotFound('Simulation not found');
  }
};

module.exports = { save, getLastSimulation, isRegistered };
