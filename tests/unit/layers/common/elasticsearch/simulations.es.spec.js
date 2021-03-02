const faker = require('faker');

const mockResult = {
  body: {
    hits: {
      hits: [
        {
          _source: {
            name: 'SOURCE'
          }
        }
      ]
    }
  }
};

const mockSearch = jest.fn(() => mockResult);
const mockUpdateByQuery = jest.fn(() => 'OK');

jest.mock(
  '@elastic/elasticsearch',
  () => ({
    Connection: class Connection {},
    Client: jest.fn(() => ({
      search: mockSearch,
      updateByQuery: mockUpdateByQuery
    }))
  }),
  { virtual: true }
);

const ContractsES = require('api-src/layers/common/elasticsearch/contractsReport.es');

describe('ContractsES', () => {
  it('should get simulation source', async () => {
    const email = faker.internet.email();
    const clientId = faker.random.uuid();
    const documentNumber = '00011122233';

    const result = await ContractsES.getClientContract({ documentNumber, email, clientId });

    const query = {
      index: 'contract',
      type: 'report',
      body: {
        query: {
          bool: {
            should: [
              {
                term: {
                  'simulation.parameters.cpf': documentNumber
                }
              },
              {
                term: {
                  'simulation.parameters.email': email
                }
              }
            ],
            must_not: {
              match: {
                clientApiId: clientId
              }
            }
          }
        }
      }
    };

    expect(mockSearch).toHaveBeenCalledWith(query);
    expect(result).toEqual([{ name: 'SOURCE' }]);
  });
});
