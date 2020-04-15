const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v4: uuid } = require('uuid');

const { ENV } = process.env;

const ContractsSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  propertyId: String,
  contractOwner: String,
  legalName: String,
  legalCNPJ: String,
  lastSimulation: {
    id: String,
    age: Number,
    cep: String,
    date: Date,
    installment: Number,
    loanValue: Number,
    loanValueSelected: Number,
    propertyValue: Number,
    rendaMensal: Number,
    term: Number,
    email: String,
    trackCode: String
  },
  makeUpIncome: [
    {
      peopleId: String,
      type: String
    }
  ],
  campaign: String,
  source: String,
  pendencies: {},
  contractPeople: [
    {
      id: String,
      role: String
    }
  ],
  whoIsSecondPayer: String,
  clientId: String
});

module.exports = Dynamoose.model(`Contract.${ENV}`, ContractsSchema, {
  create: false,
  update: false
});
