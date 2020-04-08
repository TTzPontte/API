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

const PeopleES = require('../../../../src/layers/common/elasticsearch/people.es');

describe('PeopleES', () => {
  it('should get people source', async () => {
    const email = faker.internet.email();
    const cpf = '00011122233';

    const result = await PeopleES.getPeople({ cpf, email });

    const query = {
      index: 'people',
      type: '_doc',
      body: {
        query: {
          bool: {
            should: [
              {
                term: {
                  cpf: cpf
                }
              },
              {
                term: {
                  email: email
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
