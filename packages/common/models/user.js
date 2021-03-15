const { Schema } = require('dynamoose');
const baseModel = require('./baseModel');
const Dynamoose = require('../aws/dynamooses');

const { ENV } = process.env;

const UsersSchema = new Schema({
  ...baseModel,
  id: {
    type: String,
    hashKey: true
  },
  cpf: String,
  trackingCodes: [
    {
      type: String
    }
  ],
  entityId: String,
  campaign: String,
  source: String
});

module.exports = Dynamoose.model(`User.${ENV}`, UsersSchema, {
  create: false,
  update: false
});
