const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const middy = require(`${path}/middy/middy`);
const { ssmGroup } = require(`${path}/middy/shared/ssm`);

const handler = async (event, context) => {
  console.log('event -> ', event);

  return 'Finish';
};

exports.handler = middy(handler).use(ssmGroup());
