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

const EntityES = require('common/elasticsearch/entity.es');

describe('EntityES', () => {
  it('should get entity source', async () => {
    const email = faker.internet.email();
    const documentNumber = '00011122233';

    const result = await EntityES.getEntity({ documentNumber, email });

    const query = {
      index: 'entity',
      type: '_doc',
      body: {
        query: {
          bool: {
            should: [
              {
                term: {
                  email: email
                }
              },
              {
                term: {
                  documentNumber: documentNumber
                }
              }
            ]
          }
        }
      }
    };

    expect(mockSearch).toHaveBeenCalledWith(query);
    expect(result).toEqual([{ name: 'SOURCE' }]);
  });
});
