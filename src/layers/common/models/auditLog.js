const { Schema } = require('dynamoose');
const dynamoose = require('../aws/dynamoose');
const baseModel = require('./baseModel');

const { ENV, PROJECT } = process.env;

const AuditLogSchema = new Schema(
  Object.assign({}, baseModel, {
    cid: {
      type: String,
      hashKey: true
    },
    id: {
      type: String,
      rangeKey: true
    },
    cname: String,
    ip: String,
    operation: String,
    document: String,
    data: Object
  })
);
module.exports = dynamoose.model(`${PROJECT}-AuditLog.${ENV}`, AuditLogSchema, { create: false, update: false });
