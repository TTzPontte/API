const Auth = require('common/services/auth');
const Clients = require('common/models/clients');
const jwt = require('jsonwebtoken');

describe('Auth service', () => {
  describe('verify', () => {
    let token;
    let secret;
    let clientId;
    let clientName;

    beforeEach(async () => {
      secret = 'bxHlMZb6393HftaOLFkk1pR8g-0dj9YP0CXzD-jHdHpPox10l-qEZFwJcvE-XRmKI4TH9Kyg3URBmwBq4Tp6rQ==';
      clientId = 'ramdomId';
      clientName = 'fakerName';
      token = await jwt.sign({ clientId }, secret);
    });

    it('returns a successfully response', async () => {
      const exec = jest.fn(() => ({
        clientSecret: secret,
        clientName
      }));
      Clients.queryOne = jest.fn(() => ({ exec }));

      const response = await Auth.verify(token);

      expect(response).toStrictEqual({ clientId, clientName, clientSecret: secret });
    });

    it('throws an Unauthorized error if token is not a jwt', async () => {
      try {
        await Auth.verify('dasdasd');
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('throws an Unauthorized error if clientId does not exist', async () => {
      token = jwt.sign({ body: {} }, secret);
      const exec = jest.fn(() => ({
        clientSecret: secret,
        clientName
      }));
      Clients.queryOne = jest.fn(() => ({ exec }));

      try {
        await Auth.verify(token);
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('throws an Unauthorized error if token verification fails', async () => {
      secret = '321321321';
      token = jwt.sign({ body: {} }, secret);
      const exec = jest.fn(() => ({
        clientSecret: secret,
        clientName
      }));
      Clients.queryOne = jest.fn(() => ({ exec }));

      try {
        await Auth.verify(token);
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });
  });

  describe('parseToken', () => {
    it('returns token without Bearer', () => {
      const tokenWithoutString =
        'eyJhbGciOiJIUzI1NiI4sInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjhDTVlLN1QtSE0wTUE1Si1NNjJXMjdNLVNXRjEwWlkiLCJib2R5Ijp7InVzZXIiOiJuZXRvIn0sImlhdCI6MTU4NTA3MzYzMn0.obIF8wOtMFGb7W2n4tTITP3vR6IXrVShuZ9urGpYK8I';
      const token = `Bearer ${tokenWithoutString}`;

      expect(Auth.parseToken(token)).toBe(tokenWithoutString);
    });

    it('throws an Unauthorized error if token do not exist', () => {
      try {
        Auth.parseToken();
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
      }
    });
  });
});
