const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v4: uuid } = require('uuid');

const { ENV } = process.env;

const PropertiesSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  age: String,
  address: {
    cep: String,
    city: String,
    complement: String,
    neighborhood: String,
    number: String,
    state: String,
    streetAddress: String
  },
  bedrooms: String,
  financed: String,
  financingDebt: String,
  floorArea: String,
  isResident: String,
  whoIsOwner: String,
  owners: [],
  suites: String,
  garages: String,
  haveRegistration: String,
  registrationNumber: String,
  type: String,
  documents: {
    type: 'map',
    map: {},
    default: {}
  },
  photos: {
    type: 'map',
    map: {},
    default: {}
  }
});

module.exports = Dynamoose.model(`Property.${ENV}`, PropertiesSchema, {
  create: false,
  update: false
});
