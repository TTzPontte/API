const { getNowDefaultDate, getDateIsoString } = require('../helpers/date');
const Contract = require('../models/contract');
const createError = require('http-errors');
const { getClientContract, getClientContractByDocNumber } = require('../elasticsearch/contractsReport.es');

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
  calculated: { grossLoan, installment, ltv, ltvMax, cet }
}) => {
  const lastInstallment = installment[installment.length - 1].installment;
  const firstInstallment = installment[0].installment;
  const { STATUS_GROUP_DEFAULT_ID } = process.env;

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
        cpf: cpf,
        skipMonth: skipMonth,
        gracePeriod: gracePeriod,
        loanMotivation: loanMotivation
      },
      loanValueSelected: loanValue,
      terms: [terms],
      term: terms,
      loanValuesGross: [[grossLoan]],
      installment: firstInstallment,
      installments: [[firstInstallment]],
      lastInstallments: [[lastInstallment]],
      accepted: {
        ip: sourceIp,
        time: getDateIsoString(),
        check: true
      },
      ltv: [[ltv]],
      ltvMax: [[ltvMax]],
      cet: [[cet]],
      date: getDateIsoString()
    },
    campaign: clientName,
    source: clientName,
    trackCode: trackCode,
    clientApiId: clientId,
    statusGroupContractId: STATUS_GROUP_DEFAULT_ID
  });

  return simulation.save();
};

const isRegistered = async ({ documentNumber, email, clientId }) => {
  const contracts = await getClientContract({ documentNumber, email, clientId });

  if (contracts && contracts.length) {
    throw new createError.Conflict('Customer already exists');
  }
  return false;
};

const isRegisteredByDocNumber = async ({ documentNumber, clientId }) => {
  const contracts = await getClientContractByDocNumber({ documentNumber, clientId });

  if (contracts && contracts.length) {
    throw new createError.Conflict('Customer already exists');
  }
  return false;
};

const getLastContract = async simulationId => {
  try {
    const simulation = await Contract.queryOne({ id: simulationId }).exec();
    if (simulation) return simulation;
  } catch (error) {
    console.log(error);
  }
  throw new createError.NotFound('Simulation not found');
};

module.exports = { save, getLastContract, isRegistered, isRegisteredByDocNumber };
