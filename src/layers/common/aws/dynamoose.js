var AWSXRay = require('aws-xray-sdk');
var dynamoose = require('dynamoose');

const { _X_AMZN_TRACE_ID } = process.env;
if (_X_AMZN_TRACE_ID) {
  dynamoose.AWS = AWSXRay.captureAWS(require('aws-sdk'));
}

dynamoose.AWS.config.update({
  httpOptions: {
    connectTimeout: 300
  }
});

dynamoose.AWS.config.update({
  maxRetries: 3,
  region: 'us-east-1'
});

dynamoose.setDefaults({
  waitForActive: false,
  waitForActiveTimeout: 1,
  useDocumentTypes: true,
  useNativeBooleans: true,
  saveUnknown: true
});

module.exports = dynamoose;
