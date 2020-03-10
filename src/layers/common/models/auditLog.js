const { Schema } = require('dynamoose');
const dynamoose = require('../aws/dynamoose');
const baseModel = require('./baseModel');

const { ENV, PROJECT } = process.env;

const AuditLogSchema = new Schema(
  Object.assign({}, baseModel, {
    id: {
      type: String,
      rangeKey: true
    },
    ts: String,
    ip: String,
    operation: String,
    data: Object
  })
);
module.exports = dynamoose.model(`${PROJECT}-AuditLog.${ENV}`, AuditLogSchema);
