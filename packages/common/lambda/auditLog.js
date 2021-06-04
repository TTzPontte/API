const { v1: uuid } = require('uuid');
const { sendMessage } = require('../aws/sqs');

const { ENV } = process.env;

const log = async ({ requestContext = {}, clientId, clientName }, context, document, operation, data = {}) => {
  const nameSQS = `AuditLog-Api-${ENV}`;
  const accountId = context.invokedFunctionArn.split(':')[4];
  const sourceIp = (requestContext && requestContext.identity && requestContext.identity.sourceIp) || {};

  const body = {
    cid: clientId,
    cname: clientName,
    id: uuid(),
    document,
    operation,
    ip: sourceIp || '0.0.0.0'
  };

  if (data.cid) {
    body.cid = data.cid;
    delete data.cid;
  }

  if (data) {
    body.data = data;
  }

  const result = await sendMessage(JSON.stringify(body), accountId, nameSQS);
  return result;
};

module.exports = { log };
