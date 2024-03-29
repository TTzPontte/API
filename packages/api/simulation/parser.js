const { trackCode } = require('common/helpers/trackCode');

const parser = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [] } = body;
  const sourceIp = requestContext.identity.sourceIp;
  const trackingCode = (await trackCode()) + `:${clientName}`;

  return {
    ...body,
    gracePeriod,
    loanMotivation,
    skipMonth,
    sourceIp,
    trackCode: trackingCode,
    clientName,
    clientId
  };
};

module.exports = { parser };
