const { Schema } = require('dynamoose');
const { Dynamoose } = require('../aws/dynamoose');
const { v1: uuid } = require('uuid');

const { ENV } = process.env;

const SimulationsSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  cep: String,
  cet: [
    {
      type: 'list',
      list: [Number]
    }
  ],
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
    skipMonth: Number
  },
  parcelas: [
    {
      type: 'list',
      list: [Number]
    }
  ],
  prazos: [
    {
      type: Number
    }
  ],
  valoresEmprestimeBruto: [
    {
      type: Number
    }
  ],
  valoresEmprestimo: [
    {
      type: Number
    }
  ],
  valorImovel: Number,
  createdAt: String,
  status: {
    type: String,
    default: 'PENDING'
  },
  loanMotivation: [
    {
      type: String
    }
  ],
  ultimaParcela: [
    {
      type: 'list',
      list: [Number]
    }
  ],
  clientApiId: String
});

module.exports = Dynamoose.model(`Simulations.${ENV}`, SimulationsSchema, {
  create: false,
  update: false
});
