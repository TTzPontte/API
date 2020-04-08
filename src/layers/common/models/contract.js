const { Schema } = require('dynamoose');
const Dynamoose = require('../aws/dynamoose');
const { v1: uuid } = require('uuid');

const { ENV } = process.env;

const ContractsSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  campaign: String,
  source: String,
  contractOwner: String
});

module.exports = Dynamoose.model(`Contract.${ENV}`, ContractsSchema, {
  create: false,
  update: false
});
