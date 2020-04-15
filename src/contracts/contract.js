const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const { validate } = require('./validator');
const Contract = require(`${path}/services/contract.service`);
const { success } = require(`${path}/lambda/response`);
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const contract = async event => {
  const { body, clientId } = event;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const contract = await Contract.save({ ...translatedBody, clientId });

  return success({ ...contract });
};

module.exports = { handler: middy(contract), contract };
