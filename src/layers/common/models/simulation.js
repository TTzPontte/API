const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v1: uuid } = require('uuid');

const { ENV } = process.env;

const SimulationsSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  cep: String,
  date: String,
  idade: Number,
  parametros: {
    cep: String,
    email: String,
    phone: String,
    idade: Number,
    rendaMensal: Number,
    trackCode: String,
    valImovel: Number,
    campaign: String,
    source: String,
    valorEmprestimo: Number,
    gracePeriod: Number,
    skipMonth: Number,
    loanDate: String,
    cpf: String
  },
  valorImovel: Number,
  parcelas: [{ type: 'list', list: [Number] }],
  prazos: [{ type: Number }],
  valoresEmprestimeBruto: [{ type: Number }],
  valoresEmprestimo: [{ type: Number }],
  ultimaParcela: [{ type: 'list', list: [Number] }],
  cet: [{ type: 'list', list: [Number] }],
  ltv: [{ type: Number }],
  ltvMax: [{ type: Number }],
  loanMotivation: [{ type: String }],
  clientApiId: String,
  status: {
    type: String,
    default: 'PENDING'
  },
  createdAt: String
});

module.exports = Dynamoose.model(`Simulations.${ENV}`, SimulationsSchema, {
  create: false,
  update: false
});
