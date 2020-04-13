const { contract } = require('../../../src/contracts/contract');
const Contract = require('../../../src/layers/common/services/contract.service');

describe('contract handler', () => {
  let event, saveResult;
  beforeEach(() => {
    saveResult = {
      contract: {}
    };

    event = {
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
          birth: '1997-01-18',
          cpf: '12345678911',
          child: {},
          children: 'Não',
          createdAt: '2020-04-06T19:30:45Z',
          documents: {},
          educationLevel: 'ENSINO SUPERIOR COMPLETO',
          email: 'jose.neto.chaves@codeminer42.com',
          father: {
            cpf: '41476624046',
            birth: '1965-02-15',
            email: 'paidasilva@gmail.com',
            name: 'Pai da silva pagador'
          },
          hasSiblings: 'Sim',
          incomeSource: 'ASSALARIADO',
          liveInProperty: 'Sim',
          maritalStatus: 'CASADO',
          mother: {
            averageIncome: 15000,
            birth: '1965-02-15',
            cpf: '16356520060',
            email: 'mãe+email@gmail.com',
            incomeSource: 'ASSALARIADO',
            name: 'Mãe da silva'
          },
          name: 'Jose Chaves',
          nickname: 'Jose',
          phone: '+5586998599070',
          registry: [],
          secondPayer: 'Sim',
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
          financed: 'Não',
          floorArea: '400 m²',
          isResident: 'Próprio',
          owners: [],
          suites: '1',
          type: 'Apartamento',
          garages: '1'
        },
        simulationId: 'lR0B7sQVTDqSrhQ_RyaJKw',
        makeUpIncome: [],
        pendencies: [],
        whoIsSecondPayer: 'Mãe'
      },
      clientName: 'random-name',
      clientId: 'random-id',
      requestContext: {
        identity: {
          sourceIp: '127.0.0.1'
        }
      }
    };
    Contract.save = jest.fn(() => saveResult);
  });

  it('return success', async () => {
    const response = await contract(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual(saveResult);
  });
});
