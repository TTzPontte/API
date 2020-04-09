const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');
const Clients = require('../layers/common/models/clients');

const args = process.argv.slice(2);
const clientName = args[0];

const checkIfExists = async clientId => Clients.queryOne({ clientId }).exec();

const createClient = async () => {
  const clientSecret = crypto
    .randomBytes(64)
    .toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-');

  let { apiKey: clientId } = uuidAPIKey.create();

  let check = await checkIfExists(clientId);
  while (check) {
    clientId = uuidAPIKey.create().apiKey;
    check = await checkIfExists(clientId);
  }

  const clients = new Clients({ clientName, clientId, clientSecret });
  await clients.save();

  console.log('New client created. Credentials: ');
  console.log({
    clientId,
    clientSecret,
    clientName
  });
};

createClient();
