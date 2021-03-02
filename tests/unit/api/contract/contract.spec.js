const { contract } = require('api-src/api/contracts/contract');
const Contract = require('api-src/layers/common/services/contract.service');
const Simulation = require('api-src/layers/common/services/simulation.service');
const Cognito = require('api-src/layers/common/services/cognito.service');
const body = require('../../../utils/contractBody');

describe('contract handler', () => {
  let event, saveResult;
  beforeEach(() => {
    saveResult = {
      contract: {}
    };

    event = {
      body: body(),
      clientName: 'random-name',
      clientId: 'random-id',
      requestContext: {
        identity: {
          sourceIp: '127.0.0.1'
        }
      }
    };
    Contract.save = jest.fn(() => saveResult);
    Simulation.getLastContract = jest.fn(() => {});
    Cognito.createUser = jest.fn(() => {});
  });

  it('return success', async () => {
    const response = await contract(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toStrictEqual(saveResult);
  });
});
