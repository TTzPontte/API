const { Schema } = require('dynamoose');
const baseModel = require('./baseModel');
const Dynamoose = require('../aws/dynamooses');

const { ENV } = process.env;

const ProcessSchema = new Schema({
  ...baseModel,
  contractId: {
    type: String,
    hashKey: true
  },
  screen: {
    data: {
      currentStep: Number,
      whoIsSecondPayer: String,
      haveRegistration: String,
      incomeSource: String,
      isResident: String,
      liveInProperty: String,
      maritalStatus: String,
      secondPayer: String,
      suites: String
    }
  }
});

module.exports = Dynamoose.model(`Process.${ENV}`, ProcessSchema, {
  create: false,
  update: false
});
