const jwt = require('jsonwebtoken');
const auth = require('../../../../../src/layers/common/middy/auth');
const Clients = require('../../../../../src/layers/common/models/clients');
const Auth = require('../../../../../src/layers/common/services/auth');

jest.mock('../../../../../src/layers/common/services/auth');
describe('Auth Middleware', () => {
  let handler;
  let next;
  let token;
  const secret = 'bxHlMZb6393HftaOLFkk1pR8g-0dj9YP0CXzD-jHdHpPox10l-qEZFwJcvE-XRmKI4TH9Kyg3URBmwBq4Tp6rQ==';

  beforeEach(async () => {
    token = await jwt.sign({ clientId: 'ramdomId', body: { test: 'test' } }, secret);
    handler = {
      event: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    };
    Auth.verify = jest.fn(() => ({ body: '', clientId: '1', clientName: 'test' }));
  });

  it('returns a successfully response', async () => {
    const exec = jest.fn(() => ({
      clientSecret: secret
    }));
    Clients.queryOne = jest.fn(() => ({ exec }));

    await auth().before(handler, next);

    expect(Auth.verify).toBeCalled();
  });
});
