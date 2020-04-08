const AWS = jest.requireActual('aws-sdk');
const mockConverter = Object.assign({}, AWS.DynamoDB.Converter);

jest.setTimeout(15000);

global.mockUpdateDocumentClient = jest.fn(() => ({
  promise: jest.fn()
}));

global.mockModelSave = jest.fn();

jest.mock(
  'aws-sdk',
  () => ({
    Lambda: jest.fn(() => ({
      invoke: jest.fn((_params, cb) =>
        cb(null, {
          Payload: JSON.stringify([])
        })
      )
    })),
    SQS: jest.fn(() => ({
      sendMessage: jest.fn(() => ({
        promise: jest.fn()
      }))
    })),
    CognitoIdentityServiceProvider: jest.fn(() => ({
      adminCreateUser: jest.fn(() => ({
        promise: jest.fn()
      }))
    })),
    Endpoint: jest.fn(() => ({ host: 'host' })),
    HttpRequest: jest.fn(() => ({})),
    config: {
      getCredentials: jest.fn(cb => cb(null, 'cred')),
      update: jest.fn(),
      region: 'region'
    },
    Signers: {
      V4: jest.fn(() => ({
        addAuthorization: jest.fn(),
        request: 'response'
      }))
    },
    S3: jest.fn(),
    DynamoDB: {
      Converter: mockConverter,
      DocumentClient: jest.fn(() => ({
        update: global.mockUpdateDocumentClient
      }))
    }
  }),
  { virtual: true }
);

jest.mock(
  'dynamoose',
  () => ({
    AWS: {
      config: {
        update: jest.fn()
      }
    },
    Schema: jest.fn(() => ({
      statics: {}
    })),
    setDefaults: jest.fn(),
    model: jest.fn(name => {
      const MockModel = jest.fn(() => ({
        save: global.mockModelSave
      }));
      MockModel.get = jest.fn();
      MockModel.getAll = jest.fn();
      MockModel.getById = jest.fn();
      MockModel.update = jest.fn();
      MockModel.queryOne = jest.fn();
      MockModel.batchGet = jest.fn();

      return MockModel;
    })
  }),
  { virtual: true }
);
