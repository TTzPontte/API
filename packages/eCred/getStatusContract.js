const { memoize } = require('lodash');
const { ssmPartner } = require('common/middy/shared/ssm');
const AuditLog = require('common/lambda/auditLog');
const StatusContract = require('./sendStatusContract');
const { parserResponseUpdateStatusContract } = require('./offer/parser');

const loadEnv = memoize(async () => ssmPartner('ecred').before());

const handler = async (event, context) => {
  await loadEnv();
  const { body } = event;
  const data = parserResponseUpdateStatusContract(JSON.parse(body));

  await AuditLog.log(event, context, 'ecred', 'updateStatus', body);

  return StatusContract.send(data);
};

exports.handler = handler;
