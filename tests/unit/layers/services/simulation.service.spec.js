const layerPath = '../../../../src/layers/common/';
const { save } = require(`${layerPath}services/simulation.service`);

describe('Simulation service', () => {
  describe('save', () => {
    it('saves the simulation', async () => {
      const data = {
        loanValue: 35000,
        propertyValue: 250000,
        monthlyIncome: 25000,
        terms: 180,
        age: 27,
        cep: '00000000',
        email: 'test@test.com',
        phone: '+55 (99) 99999-9999',
        trackCode: 'random-track-code',
        loanMotivation: ['RENOVATE_HOUSE'],
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: '127.0.0.0',
        clientId: 'random-client-id'
      };
      const calculated = { netLoan: 38000, grossLoan: 45000, installment: [{ installment: 1200 }], ltv: 0.3, ltvMax: 0.5, cet: 0.03 };

      await save({ data, calculated });

      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
});
