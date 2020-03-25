const { trackCode } = require('/opt/helpers/fingerprint');

const parser = async event => {
  const { body, clientId, clientName, requestContext } = event;
  const data = JSON.parse(body);
  const { gracePeriod = 0, skipMonth = 0, loanMotivation = [] } = data;
  const sourceIp = requestContext.identity.sourceIp || clientId;
  const trackingCode = (await trackCode()) + `:${clientId}`;

  return {
    ...data,
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
