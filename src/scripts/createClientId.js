const uuidAPIKey = require('uuid-apikey');
const Clients = require('../layers/common/models/clients');

console.log('Creating clientID');
const clientName = 'test';
const { apiKey: clientId, uuid: secretKey } = uuidAPIKey.create();
const clients = new Clients({ clientName, clientId, secretKey });
clients.save();
