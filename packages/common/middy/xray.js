const awsXRay = require('aws-xray-sdk');
const AWS = require('aws-sdk');
const { once } = require('lodash');

const load = once(() => {
  awsXRay.captureAWS(AWS);
});

module.exports = () => ({
  before: (handler, next) => {
    const { _X_AMZN_TRACE_ID } = process.env;
    if (_X_AMZN_TRACE_ID) {
      load();
    }
    next();
  }
});
