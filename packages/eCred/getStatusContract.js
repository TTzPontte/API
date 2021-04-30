const { memoize, get } = require('lodash');
const AWS = require('aws-sdk');
const { ssmPartner } = require('common/middy/shared/ssm');
const AuditLog = require('common/lambda/auditLog');

const StatusContract = require('./sendStatusContract');
const { parserResponseUpdateStatusContract } = require('./offer/parser');

const loadEnv = memoize(async () => ssmPartner('ecred').before());

const shouldInformECred = record =>
  record.eventName === 'MODIFY' &&
  get(record, 'dynamodb.NewImage.source.S', '')
    .toLowerCase()
    .match(/ecred$/);

const unmarshall = value => AWS.DynamoDB.Converter.unmarshall(value);

const handler = async (event, context) => {
  await loadEnv();
  const updates = event.Records.filter(shouldInformECred)
    .map(({ dynamodb }) => unmarshall(dynamodb.NewImage))
    .map(parserResponseUpdateStatusContract)
    .filter(({ status }) => status);

  await AuditLog.log(event, context, 'ecred', 'updateStatus', { updates });
  await Promise.all(updates.map(StatusContract.send));

  return updates;
};

exports.handler = handler;
