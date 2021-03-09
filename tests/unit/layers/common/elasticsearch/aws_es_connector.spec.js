const faker = require('faker');

const mockEndpoint = jest.fn(() => ({ host: 'host' }));
const mockHttpRequest = jest.fn(() => ({}));
const mockGetCredentials = jest.fn(cb => cb(null, 'cred'));
const mockRequest = jest.fn();
const mockConnection = class Connection {
  get url() {
    return { href: 'href' };
  }
  request(...params) {
    mockRequest(...params);
  }
};
const mockAddAuthorization = jest.fn();
const mockV4 = jest.fn(() => ({ addAuthorization: mockAddAuthorization, request: 'response' }));
const mockSigners = { V4: mockV4 };
const mockConfig = { getCredentials: mockGetCredentials, region: 'region' };

jest.mock(
  'aws-sdk',
  () => ({
    Endpoint: mockEndpoint,
    HttpRequest: mockHttpRequest,
    config: mockConfig,
    Signers: mockSigners
  }),
  { virtual: true }
);
jest.mock(
  'common/elasticsearch/entity.es',
  () => () => ({
    Connection: mockConnection
  }),
  { virtual: true }
);

const AWS = require('common/elasticsearch/aws_es_connector');

describe('elasticsearch', () => {
  describe('AwsConnector', () => {
    let AWSCon;

    beforeEach(() => {
      AWSCon = new AWS.AwsConnector();
    });

    describe('request', () => {
      it('should made a request', async () => {
        const params = {
          body: 'body'
        };

        await AWSCon.request(params, () => {});

        expect(mockRequest).toHaveBeenCalledWith('response', expect.any(Function));
      });
    });

    describe('createRequest', () => {
      let params;
      let req;

      beforeEach(() => {
        params = {
          body: 'body'
        };
        req = AWSCon.createRequest(params);
      });

      it('should instantiate a AWS Endpoint', () => {
        expect(mockEndpoint).toHaveBeenCalledWith('href');
      });

      it('should instantiate a AWS HttpRequest', () => {
        expect(mockHttpRequest).toHaveBeenCalledWith({ host: 'host' });
      });

      it('should return a object with config request', () => {
        const result = Object.assign({}, params, {
          headers: {
            'Content-Length': Buffer.byteLength(params.body),
            Host: 'host'
          },
          region: 'region'
        });

        expect(req).toEqual(result);
      });
    });

    describe('getAWSCredentials', () => {
      it('should get credentials', async () => {
        await AWSCon.getAWSCredentials();
        expect(mockGetCredentials).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should return the creds if success', async () => {
        const cred = await AWSCon.getAWSCredentials();
        expect(cred).toEqual('cred');
      });
    });

    describe('signRequest', () => {
      let request, creds;

      beforeEach(() => {
        request = faker.internet.url();
        creds = faker.internet.userName();
        AWSCon.signRequest(request, creds);
      });

      it('should instantiate a Signer V4', () => {
        expect(mockV4).toHaveBeenCalledWith(request, 'es');
      });

      it('should add authorization in signer', () => {
        expect(mockAddAuthorization).toHaveBeenCalledWith(creds, expect.any(Date));
      });
    });
  });
});
