const Clients = require('common/models/clients');

const generatePolicy = (principalId, clientName, resource, effect) => ({
  principalId,
  context: { clientName },
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect || 'Deny',
        Resource: resource.replace(/\/.+\/(.+)\/.+$/, '/*/$1/*')
      }
    ]
  }
});

const handler = async ({ methodArn, headers: { Authorization } }) => {
  try {
    const [clientId, pass] = Buffer.from(Authorization.replace(/^\s*[Bb]asic\s+/, ''), 'base64')
      .toString()
      .split(':');

    console.log(`clientId: ${clientId}`);

    const { clientName, clientSecret } = await Clients.queryOne({ clientId }).exec();

    console.log(`clientName: ${clientName}`);

    return generatePolicy(clientId, clientName, methodArn, clientSecret === pass && 'Allow');
  } catch (e) {
    console.log('Error: ', e);
  }
  return 'Unauthorized';
};
module.exports = { handler };
