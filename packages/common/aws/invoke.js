const _ = require('lodash/fp');
const AWS = require('aws-sdk');

const Lambda = new AWS.Lambda();

const invoke = _.curry((functionName, payload) => awsInvoke(functionName, payload));

const composeAWSNameForFunction = functionName => `${functionName}-${process.env.ENV}`;

const awsInvoke = _.curry((functionName, payload) => {
  const params = {
    InvocationType: 'RequestResponse',
    FunctionName: composeAWSNameForFunction(functionName),
    LogType: 'None',
    Payload: JSON.stringify(payload)
  };

  return new Promise((fulfill, reject) => {
    Lambda.invoke(params, (error, data) => {
      if (error) reject(error);
      else {
        if (_.has('FunctionError', data)) reject(JSON.parse(data.Payload).errorMessage);
        else fulfill(JSON.parse(data.Payload));
      }
    });
  });
});

module.exports = { invoke };
