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
        people: {},
        property: {},
        simulationId: 'lR0B7sQVTDqSrhQ_RyaJKw',
        makeUpIncome: [],
        pendencies: [],
        whoIsSecondPayer: 'Cônjuge'
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
