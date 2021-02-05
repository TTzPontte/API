const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { parserResponseUpdateStatusContract } = require('./offer/parser');

const handler = async (event, context) => {
  const { body } = event;
  const data = parserResponseUpdateStatusContract(body);
  console.log('data -> ', data);

  return 'Finish';
};

exports.handler = handler;
