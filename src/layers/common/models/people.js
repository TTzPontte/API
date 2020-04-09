const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v4: uuid } = require('uuid');

const { ENV } = process.env;

const PeopleSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  email: String,
  accounts: [],
  address: {
    cep: String,
    city: String,
    complement: String,
    neighborhood: String,
    number: String,
    state: String,
    streetAddress: String
  },
  averageIncome: Number,
  bacen: Boolean,
  birth: String,
  cpf: String,
  incomeSource: String,
  incomeSourceActivity: String,
  liveInProperty: String,
  maritalStatus: String,
  educationLevel: String,
  children: String,
  name: String,
  nickname: String,
  phone: String,
  spouseResidence: String,
  registry: [],
  cnpj: [
    {
      num: String,
      name: String,
      relationship: String
    }
  ],
  secondPayer: String,
  hasSiblings: String,
  spouse: {
    id: String
  },
  sibling: {
    id: String
  },
  mother: {
    id: String
  },
  father: {
    id: String
  },
  child: {
    id: String
  }
});

module.exports = Dynamoose.model(`People.${ENV}`, PeopleSchema, {
  create: true,
  update: true
});
