const { parser } = require('./parser');

const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const middy = require(`${path}/middy/middy`);

const simulation = async event => {
  const data = await parser(event);

  console.log('data -> ', data);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello world'
    })
  };

  return response;
};

module.exports = { handler: middy(simulation), simulation };
