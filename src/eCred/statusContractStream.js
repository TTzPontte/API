const AWS = require('aws-sdk');
const path = process.env.NODE_ENV === 'test' ? '../layers/common/' : '/opt/';
const middy = require(`${path}/node_modules/middy`);
// const ContractReportES = require(`${path}elasticsearch/contractReport.es`);

const { ssmSystem } = require(`${path}middy/shared/ssm`);
const xray = require(`${path}middy/shared/xray`);

const contractsEsStreamHandler = async event => {
  const { Records } = event;

  await Promise.all(
    Records.map(async ({ eventName, dynamodb }) => {
      let data;
      switch (eventName) {
        case 'MODIFY':
          data = AWS.DynamoDB.Converter.unmarshall(dynamodb.NewImage);
          console.log('no modify -> ', { data });
          return true;
        case 'REMOVE':
          data = AWS.DynamoDB.Converter.unmarshall(dynamodb.Keys);
          console.log('no remove -> ', { data });
          return true;
      }
    })
  );

  return 'Finish';
};

module.exports = {
  handler: middy(contractsEsStreamHandler)
    .use(xray())
    .use(ssmSystem()),
  contractsEsStreamHandler
};
