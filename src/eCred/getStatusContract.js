const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const StatusContract = require('./sendStatusContract');
const { ssmEcred } = require(`${path}/middy/shared/ssm`);
const AuditLog = require(`${path}/lambda/auditLog`);
const { parserResponseUpdateStatusContract } = require('./offer/parser');

const handler = async (event, context) => {
  ssmEcred();
  const { body } = event;
  const data = parserResponseUpdateStatusContract(JSON.parse(body));

  const response = await StatusContract.send(data);
  await AuditLog.log(event, context, 'ecred', 'updateStatus', body);

  return response;
};

exports.handler = handler;
