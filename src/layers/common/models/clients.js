const { Schema } = require('dynamoose');
const dynamoose = require('../aws/dynamoose');
const baseModel = require('./baseModel');

const { ENV, PROJECT } = process.env;

const ClientsApiSchema = new Schema(
  Object.assign({}, baseModel, {
    clientId: String,
    name: Str ng,
    clientSecret: String,
    clientName: String
  })
);
module.exports = dynamoose.model(`ClientsApi.${ENV}`, ClientsApiSchema);
