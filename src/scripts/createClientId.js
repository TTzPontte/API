const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');
const Clients = require('../layers/common/models/clients');
const jwt = require('jsonwebtoken');
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

const token = jwt.sign(
  {
    clientId: '8CMYK7T-HM0MA5J-M62W27M-SWF10ZY',
    body: {
      people: {
        address: {
          cep: '02141000',
          city: 'São Paulo',
          neighborhood: 'Vila Sabrina',
          number: '1131',
          state: 'SP',
          streetAddress: 'Avenida João Simão de Castro'
        },
        averageIncome: 30000,
        birth: '18-01-1997',
        cpf: '48548194057',
        child: {},
        children: true,
        createdAt: '2020-04-06T19:30:45Z',
        documents: {},
        educationLevel: 'COLLEGE',
        email: 'jose.neto+65@codeminer42.com',
        father: {
          cpf: '67774457062',
          birth: '1965-02-15',
          email: 'paidasilva@gmail.com',
          name: 'Pai da silva pagador'
        },
        hasSiblings: true,
        incomeSource: 'SALARIED',
        liveInProperty: true,
        maritalStatus: 'MARRIED',
        mother: {
          averageIncome: 15000,
          birth: '1965-02-15',
          cpf: '16356520060',
          email: 'mãe+email@gmail.com',
          incomeSource: 'SALARIED',
          name: 'Mãe da silva'
        },
        name: 'Jose Chaves',
        nickname: 'Jose',
        phone: '+5586998599070',
        secondPayer: true,
        sibling: {},
        spouse: {
          birth: '1997-09-14',
          cpf: '75798405028',
          email: 'teste+t332@gmail.com',
          name: 'Isabelly'
        }
      },
      property: {
        address: {
          cep: '02141000',
          city: 'São Paulo',
          neighborhood: 'Vila Sabrina',
          number: '1131',
          state: 'SP',
          streetAddress: 'Avenida João Simão de Castro'
        },
        age: '<=2',
        bedrooms: '3',
        financed: false,
        floorArea: '400 m²',
        isResident: 'OWN',
        owners: [],
        suites: '1',
        type: 'APARTMENT',
        garages: '1'
      },
      simulationId: 'lR0B7sQVTDqSrhQ_RyaJKw',
      makeUpIncome: [],
      pendencies: [],
      whoIsSecondPayer: 'mother'
    }
  },
  'bxHlMZb6393HftaOLFkk1pR8g-0dj9YP0CXzD-jHdHpPox10l-qEZFwJcvE-XRmKI4TH9Kyg3URBmwBq4Tp6rQ=='
);

console.log(token);
