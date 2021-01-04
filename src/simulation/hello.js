const path = process.env.NODE_ENV === 'test' ? '../layers/common/' : '/opt/';
const Lambda = require(`${path}lambda`);
const middy = require(`${path}middy/middy`);

const handler = async event => {
  return Lambda.Response.success(`Hello world: ${event.clientId} e ${event.body}`);
};

exports.handler = middy(handler);
