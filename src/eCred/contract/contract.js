const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { validate } = require('./validator');
const Simulation = require(`${path}/services/simulation.service`);
const Offer = require(`${path}/services/offer.service`);
const { parserBody, parserLastContract, parserResponseContract } = require('./parser');
const middy = require(`${path}/middy/middy`);
const translateBody = require('./translate');
const { success } = require(`${path}/lambda/response`);
const { ssmGroup } = require(`${path}/middy/shared/ssm`);
const AuditLog = require(`${path}/lambda/auditLog`);

const contract = async (event, context) => {
  const { body, clientId } = event;

  const { proposal_id } = body.order;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const bodyParsed = parserBody(translatedBody);

  const { documentNumber } = bodyParsed.entity;

  const lastContract = await Simulation.getLastContract(proposal_id);

  const lastContractParsed = parserLastContract({ lastContract, bodyParsed });

  const lastEntity = await Offer.getLastEntity({ documentNumber });

  const contract = await Offer.saveContract({ ...bodyParsed, clientId, lastContract: lastContractParsed, lastEntity });

  await AuditLog.log(event, context, 'ecred', 'contract', body);

  const response = parserResponseContract({ ...contract });

  return success(response);
};

module.exports = { handler: middy(contract).use(ssmGroup()), contract };
