const { Schema } = require('dynamoose');
const dynamoose = require('../aws/dynamooses');
const baseModel = require('./baseModel');

const { ENV } = process.env;

const ClientsApiSchema = new Schema(
  Object.assign({}, baseModel, {
    clientId: String,
    name: String,
    clientSecret: String,
    clientName: String
  })
);
module.exports = dynamoose.model(`ClientsApi.${ENV}`, ClientsApiSchema);
