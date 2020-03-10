const { handler } = require('../../../src/audit/receiver');
const mock = require('./mock.json');
const mockerror = require('./mockerror.json');

const AuditLog = require('../../../src/layers/common/services/auditlog');

describe('Audit Log', () => {
  beforeEach(() => {
    AuditLog.save = jest.fn(() => [JSON.parse(mock.Records[0].body)]);
  });

  describe('receiver handler', () => {
    describe('when send a correct payload', () => {
      it.skip('should return 200', async () => {
        const response = await handler(mock);
        expect(response.statusCode).toBe(200);
        const expectedResponse = JSON.parse(mock.Records[0].body);
        const records = JSON.parse(response.body).records[0];
        expect(records).toEqual(expectedResponse);
      });
    });

    describe('when send an invalid payload', () => {
      it('should return 400', async () => {
        const records = { Records: [] };
        const response = await handler(records);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).msg).toEqual('You should send at least one record');
      });

      it.skip('should return 500', async () => {
        AuditLog.save = jest.fn(() => {
          throw new Error('Not Found');
        });

        const response = await handler(mockerror);
        expect(response.statusCode).toBe(500);
      });
    });

    describe('when not send a payload', () => {
      it('should return 400', async () => {
        const response = await handler({});
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).msg).toEqual('Bad request');
      });
    });
  });
});
