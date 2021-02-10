const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { ssmEcred } = require(`${path}/middy/shared/ssm`);
const { parserResponseUpdateStatusContract } = require('./offer/parser');
const { ECRED_DOMAIN } = process.env;

const handler = async (event, context) => {
  const { body } = event;
  const data = parserResponseUpdateStatusContract(JSON.parse(body));
  console.log('data -> ', data);
  const endpointEcred = `${ECRED_DOMAIN}/ecred-integration/v1/order/status/{partnerKey}`;
  console.log('endpointEcred -> ', endpointEcred);

  return 'Finish';
};

exports.handler = handler.use(ssmEcred);
