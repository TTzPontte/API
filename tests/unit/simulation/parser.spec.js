const { parser } = require('../../../src/simulation/parser');
const { trackCode } = require('../../../src/layers/common/helpers/fingerprint');

describe('simulation', () => {
  describe('parser', () => {
    let event;
    beforeEach(() => {
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
      event.body = JSON.stringify({
        loanMotivation: ['PAY_OFF_DEBTS'],
        loanValue: 22000
      });

      const expectedResult = {
        loanMotivation: ['PAY_OFF_DEBTS'],
        loanValue: 22000,
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: '127.0.0.1',
        clientName: 'random-name',
        trackCode: (await trackCode()) + ':random-id',
        clientId: 'random-id'
      };

      const parsed = await parser(event);

      expect(parsed).toStrictEqual(expectedResult);
    });
    it('returns the parsed without loan motivation', async () => {
      event.body = JSON.stringify({
        loanValue: 22000
      });
      const expectedResult = {
        loanMotivation: [],
        loanValue: 22000,
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: '127.0.0.1',
        clientName: 'random-name',
        trackCode: (await trackCode()) + ':random-id',
        clientId: 'random-id'
      };

      const parsed = await parser(event);

      expect(parsed).toStrictEqual(expectedResult);
    });
  });
});
