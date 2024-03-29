const { validate } = require('./validator');
const Simulation = require('common/services/simulation.service');
const Contract = require('common/services/contract.service');
const Offer = require('common/services/offer.service');
const { parserBody, parserLastContract, parserResponseContract } = require('./parser');
const middyNoAuth = require('common/middy/middyNoAuth');
const translateBody = require('./translate');
const { success } = require('common/lambda/response');
const { ssmGroup } = require('common/middy/shared/ssm');
const { ssmCognito } = require('common/middy/shared/ssm');
const AuditLog = require('common/lambda/auditLog');

const contract = async (event, context) => {
  const { body, clientId } = event;

  await validate({ ...body, clientId });

  const translatedBody = translateBody(body);

  const bodyParsed = parserBody(translatedBody);

  const { documentNumber } = bodyParsed.entity;

  const { proposal_id } = body.order;

  const lastContract = await Simulation.getLastContract(proposal_id);

  const lastContractParsed = parserLastContract({ lastContract, bodyParsed });

  const lastEntity = await Offer.getLastEntity({ documentNumber });

  const contract = await Contract.saveEcred({
    ...bodyParsed,
    clientId,
    lastContract: lastContractParsed,
    lastEntity
  });

  await AuditLog.log(event, context, 'ecred', 'contract', body);

  const response = parserResponseContract({ ...contract });

  return success(response);
};

module.exports = {
  handler: middyNoAuth(contract)
    .use(ssmGroup())
    .use(ssmCognito()),
  contract
};
