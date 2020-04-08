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

const SimulationsES = require('../../../../../src/layers/common/elasticsearch/simulations.es');

describe('SimulationsES', () => {
  it('should get simulation source', async () => {
    const email = faker.internet.email();
    const clientId = faker.random.uuid();
    const cpf = '00011122233';

    const result = await SimulationsES.getClientSimulation({ cpf, email, clientId });

    const query = {
      index: 'pontte',
      type: 'simulations',
      body: {
        query: {
          bool: {
            should: [
              {
                term: {
                  'parametros.cpf': cpf
                }
              },
              {
                term: {
                  'parametros.email': email
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
