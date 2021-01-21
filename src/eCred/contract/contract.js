const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { validate } = require('./validator');
const Simulation = require(`${path}/services/simulation.service`);
const Offer = require(`${path}/services/offer.service`);
const { parserBody } = require('./parser');
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const { success } = require(`${path}/lambda/response`);
const { ssmCognito } = require(`${path}/middy/shared/ssm`);

const contract = async event => {
  const { body, clientId } = event;
  const { proposal_id } = body.order;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const bodyParsed = parserBody(translatedBody);
  const { documentNumber } = bodyParsed.entity;

  const lastContract = await Simulation.getLastContract(proposal_id);

  const lastEntity = await Offer.getLastEntity({ documentNumber });

  const contract = await Offer.saveContract({ ...bodyParsed, clientId, lastContract, lastEntity });

  return success({ ...contract });
};

module.exports = { handler: middy(contract).use(ssmCognito()), contract };
