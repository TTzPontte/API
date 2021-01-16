const uuid = require('uuid/v1');
const { SQS } = require('../aws');

const { ENV } = process.env;

const log = async ({ requestContext = {} }, context, document, operation, data = {}) => {
  const nameSQS = `AuditLog_${ENV}`;
  const accountId = context.invokedFunctionArn.split(':')[4];
  const user = (requestContext && requestContext.authorizer && requestContext.authorizer.claims) || {};
  const sourceIp = (requestContext && requestContext.identity && requestContext.identity.sourceIp) || {};

  const body = {
    uid: user['custom:uid'] || 'system',
    id: uuid(),
    document,
    operation,
    ts: new Date().toISOString(),
    ip: sourceIp || '0.0.0.0',
    email: user.email || '',
    user: {
      name: user.name || '',
      picture: user.picture || ''
    }
  };

  if (data.cid) {
    body.cid = data.cid;
    delete data.cid;
  }

  if (data) {
    body.data = data;
  }

  const result = await SQS.sendMessage(JSON.stringify(body), accountId, nameSQS);
  return result;
};

module.exports = { log };