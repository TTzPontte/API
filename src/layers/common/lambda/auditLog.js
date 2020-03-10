const uuid = require('uuid/v1');
const { sendMessage } = require('../aws/sqs');

const { ENV } = process.env;

const log = async ({ requestId, event, context, operation, data }) => {
  const nameSQS = `ApiAuditLog.${ENV}`;
  const accountId = context.invokedFunctionArn.split(':')[4];

  const body = {
    id: uuid(),
    ts: new Date().toISOString(),
    ip: event.requestContext.identity.sourceIp,
    operation,
    data
  };

  const result = await sendMessage(JSON.stringify(body), accountId, nameSQS);
  return result;
};

module.exports = { log };
