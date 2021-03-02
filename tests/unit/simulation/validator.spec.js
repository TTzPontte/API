const { validate } = require('api-src/simulation/validator');

describe('simulation', () => {
  describe('validator', () => {
    let data;
    beforeEach(() => {
      data = {
        loanValue: 68000,
        propertyValue: 310000,
        monthlyIncome: 6000,
        loanMotivation: ['RENOVATE_HOUSE', 'ANOTHER_REASON'],
        age: 27,
        documentNumber: '00011122233',
        phone: '+5551999999999',
        cep: '93347300',
        terms: 210,
        email: 'fabiano.furlan@gmail.com'
      };
    });
    it('not throw', async () => {
      expect(async () => validate(data)).not.toThrow();
    });
    describe('throws error when', () => {
      describe('loan value', () => {
        it('has value below than 30.000', async () => {
          data.loanValue = 29999;
          await expect(validate(data)).rejects.toThrow();
        });
        it('has a higher value than 5.000.000', async () => {
          data.loanValue = 6000000;
          await expect(validate(data)).rejects.toThrow();
        });
        it('not a number', async () => {
          data.loanValue = '29999';

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('property', () => {
        it('has value below than 200.000', async () => {
          data.propertyValue = 190000;

          await expect(validate(data)).rejects.toThrow();
        });
        it('not a number', async () => {
          data.propertyValue = '200000';

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('loan motivation', () => {
        it('not an array', async () => {
          data.loanMotivation = 'PAY_OFF_DEBTS';

          await expect(validate(data)).rejects.toThrow();
        });
        it('not in available options', async () => {
          data.loanMotivation = ['NONE'];

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('documentNumber', () => {
        it('has invalid length', async () => {
          data.documentNumber = '55';

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('phone', () => {
        it('has invalid length', async () => {
          data.phone = '55 51 99999-9999';

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('terms', () => {
        it('not in available options', async () => {
          data.terms = 220;

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('email', () => {
        it('not is an email', async () => {
          data.terms = 'test@';

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('grace period', () => {
        it('not in available options', async () => {
          data.gracePeriod = 4;

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('skip month', () => {
        it('not in available options', async () => {
          data.skipMonth = 13;

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('age', () => {
        it('has less than 18', async () => {
          data.age = 17;

          await expect(validate(data)).rejects.toThrow();
        });
        it('has more than 75', async () => {
          data.age = 76;

          await expect(validate(data)).rejects.toThrow();
        });
      });

      describe('cep', () => {
        it('has invalid length', async () => {
          data.cep = '999999';

          await expect(validate(data)).rejects.toThrow();
        });
        it('has invalid type', async () => {
          data.cep = 999999300;

          await expect(validate(data)).rejects.toThrow();
        });
      });
    });
  });
});
