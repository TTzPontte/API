const StatusContract = require('./sendStatusContract');
const { ssmPartner } = require('common/middy/shared/ssm');
const AuditLog = require('common/lambda/auditLog');
const { parserResponseUpdateStatusContract } = require('./offer/parser');

const handler = async (event, context) => {
  ssmPartner('ecred');
  const { body } = event;
  const data = parserResponseUpdateStatusContract(JSON.parse(body));

  const response = await StatusContract.send(data);
  await AuditLog.log(event, context, 'ecred', 'updateStatus', body);

  return response;
};

exports.handler = handler;
