const { getNowDefaultDate, getDateIsoString } = require('../helpers/date');
const Contract = require('../models/contract');
const createError = require('http-errors');
const { getClientContract } = require('../elasticsearch/contractsReport.es');

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

  const simulation = new Contract({
    simulation: {
      parameters: {
        propertyValue: propertyValue,
        cep: cep,
        loanValue: loanValue,
        age: age,
        monthlyIncome: monthlyIncome,
        email: email,
        phone: phone,
        loanDate: getNowDefaultDate(),
        cpf: cpf
      },
      loanMotivation: loanMotivation,
      skipMonth: skipMonth
    },
    terms: [terms],
    loanValue: [netLoan],
    loanValuesGross: [grossLoan],
    installments: [[firstInstallment]],
    lastInstallments: [[lastInstallment]],
    campaign: clientName,
    source: clientName,
    trackCode: trackCode,
    gracePeriod: gracePeriod,
    accepted: {
      ip: sourceIp,
      time: getDateIsoString(),
      check: true
    },

    ltv: [[ltv]],
    ltvMax: [[ltvMax]],
    cet: [[cet]],
    date: getDateIsoString(),
    clientApiId: clientId
  });

  return simulation.save();
};

const isRegistered = async ({ cpf, email, clientId }) => {
  const contracts = await getClientContract({ cpf, email, clientId });

  if (contracts && contracts.length) {
    throw new createError.Conflict('Customer already exists');
  }
  return false;
};

const getLastContract = async simulationId => {
  try {
    const { trackCode, campaign, source, id, simulation } = await Contract.queryOne({ id: simulationId }).exec();
    const { parameters, terms, installments, loanValueSelected } = simulation;
    const { age, cep, email, loanDate, monthlyIncome, propertyValue, loanValue } = parameters;
    const installment = installments[0];
    return {
      id,
      age: age,
      cep: cep,
      date: loanDate,
      installment: installment[0],
      loanValue: loanValue,
      loanValueSelected: loanValueSelected,
      propertyValue: propertyValue,
      monthlyIncome: monthlyIncome,
      term: terms[0],
      email: email,
      trackCode,
      campaign,
      source
    };
  } catch (error) {
    throw new createError.NotFound('Simulation not found');
  }
};

module.exports = { save, getLastContract, isRegistered };
