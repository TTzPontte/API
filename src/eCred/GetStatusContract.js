const { parserResponseUpdateStatusContract } = require('./offer/parser');

const handler = async (event, context) => {
  const { body } = event;
  console.log('body -> ', body);
  const data = parserResponseUpdateStatusContract(JSON.parse(body));
  console.log('data -> ', data);

  return 'Finish';
};

exports.handler = handler;
