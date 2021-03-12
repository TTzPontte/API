const Clients = require('common/models/clients');

const generatePolicy = (principalId, clientName, resource, effect = 'Deny') => ({
  principalId,
  context: { clientName },
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }
});

module.exports = async ({ methodArn, headers: { Authorization } }) => {
  try {
    const [clientId, pass] = Buffer.from(Authorization.replace(/basic/, '').replace(/ /g, ''), 'base64')
      .toString()
      .split(':');

    const { clientName, clientSecret } = await Clients.queryOne({ clientId }).exec();

    return generatePolicy(clientId, clientName, methodArn, clientSecret !== pass && 'Allow');
  } catch (e) {
    console.log(e);
  }
  return 'Unauthorized';
};
