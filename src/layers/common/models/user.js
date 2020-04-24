const { Schema } = require('dynamoose');
const baseModel = require('./baseModel');
const Dynamoose = require('../aws/dynamoose');

const { ENV } = process.env;

const UsersSchema = new Schema({
  ...baseModel,
  id: {
    type: String,
    hashKey: true
  },
  trackingCodes: [
    {
      type: String
    }
  ],
  peopleId: String,
  campaign: String,
  source: String
});

module.exports = Dynamoose.model(`User.${ENV}`, UsersSchema, {
  create: false,
  update: false
});
