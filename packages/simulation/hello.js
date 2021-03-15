const Lambda = require('common/lambda');
const middy = require('common/middy/middy');

const handler = async event => {
  return Lambda.Response.success(`Hello world: ${event.clientId} e ${event.body}`);
};

exports.handler = middy(handler);
