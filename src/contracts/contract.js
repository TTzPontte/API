const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const Contract = require(`${path}/services/contract.service`);
const { success } = require(`${path}/lambda/response`);
const middy = require(`${path}/middy/middy`);

const contract = async event => {
  const { body } = event;
  const contract = await Contract.save(body);

  const response = {
    ...contract
  };

  return success(response);
};

module.exports = { handler: middy(contract), contract };
