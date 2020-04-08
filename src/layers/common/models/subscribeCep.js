const { Schema } = require('dynamoose');
const { v1: uuid } = require('uuid');
const baseModel = require('./baseModel');
const Dynamoose = require('../aws/dynamoose');

const { ENV } = process.env;

const subscribeCepSchema = new Schema({
  ...baseModel,
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  date: String,

  age: Number,
  email: String,
  phone: String,
  cpf: String,
  cep: String,

  propertyValue: Number,
  monthlyIncome: Number,
  loanValue: Number,
  gracePeriod: Number,
  skipMonth: Number,

  trackCode: String,
  campaign: String,
  source: String,

  installment: Number,
  terms: Number,
  grossLoan: Number,
  netLoan: Number,
  cet: Number,
  loanMotivation: [{ type: String }],
  lastInstallment: Number,
  ltv: Number,
  ltvMax: Number,

  clientApiId: String
});

module.exports = Dynamoose.model(`SubscribeCep.${ENV}`, subscribeCepSchema, {
  create: false,
  update: false
});
