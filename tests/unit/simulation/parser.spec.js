const { parser } = require('api-src/api/simulation/parser');
const { trackCode } = require('common/helpers/trackCode');
jest.mock('common/helpers/trackCode');

describe('simulation', () => {
  describe('parser', () => {
    let event, id;
    beforeEach(() => {
      id = '1234-1234-1234-1234';
      trackCode.mockReturnValueOnce(id);
      event = {
        clientName: 'random-name',
        clientId: 'random-id',
        requestContext: {
          identity: {
            sourceIp: '127.0.0.1'
          }
        }
      };
    });

    it('returns the parsed event', async () => {
      event.body = {
        loanMotivation: ['PAY_OFF_DEBTS'],
        loanValue: 22000
      };

      const expectedResult = {
        loanMotivation: ['PAY_OFF_DEBTS'],
        loanValue: 22000,
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: '127.0.0.1',
        clientName: 'random-name',
        trackCode: `${id}:random-name`,
        clientId: 'random-id'
      };

      const parsed = await parser(event);

      expect(parsed).toStrictEqual(expectedResult);
    });

    it('returns the parsed without loan motivation', async () => {
      event.body = {
        loanValue: 22000
      };
      const expectedResult = {
        loanMotivation: [],
        loanValue: 22000,
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: '127.0.0.1',
        clientName: 'random-name',
        trackCode: `${id}:random-name`,
        clientId: 'random-id'
      };

      const parsed = await parser(event);

      expect(parsed).toStrictEqual(expectedResult);
    });
  });
});
