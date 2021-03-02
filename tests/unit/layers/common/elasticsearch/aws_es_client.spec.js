const faker = require('faker');

const mockClient = jest.fn();
const mockAwsConnector = faker.internet.url();

jest.mock('api-src/layers/common/elasticsearch/aws_es_connector', () => ({ AwsConnector: mockAwsConnector }));
jest.mock('@elastic/elasticsearch', () => ({ Client: mockClient }), { virtual: true });

describe('elasticsearch', () => {
  describe('client', () => {
    it('should instance a new Client', () => {
      require('api-src/layers/common/elasticsearch/aws_es_client');

      const params = {
        node: process.env.ES_ENDPOINT,
        Connection: mockAwsConnector,
        log: 'trace'
      };

      expect(mockClient).toHaveBeenCalledWith(params);
    });
  });
});
