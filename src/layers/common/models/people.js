const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v4: uuid } = require('uuid');

const { ENV } = process.env;

const addressSchema = {
  type: 'map',
  map: {
    cep: String,
    city: String,
    complement: String,
    neighborhood: String,
    number: String,
    state: String,
    streetAddress: String
  },
  default: {}
};

const personSchema = {
  id: String,
  name: String,
  cpf: String,
  birth: String,
  email: String,
  incomeSource: String,
  incomeSourceActivity: String,
  averageIncome: String,
  address: addressSchema,
  documents: {
    type: 'map',
    map: {},
    default: {}
  }
};

const PeopleSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  email: String,
  accounts: [],
  address: addressSchema,
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
  spouse: personSchema,
  sibling: personSchema,
  mother: personSchema,
  father: personSchema,
  child: personSchema,
  documents: {
    type: 'map',
    map: {},
    default: {}
  }
});

module.exports = Dynamoose.model(`People.${ENV}`, PeopleSchema, {
  create: true,
  update: true
});
