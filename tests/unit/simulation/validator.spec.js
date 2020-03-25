const { validate } = require('../../../src/simulation/validator');

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
        cpf: '00011122233',
        phone: '+55 (51) 99999-9999',
        cep: '93347300',
        terms: 210,
        email: 'fabiano.furlan@gmail.com'
      };
    });
    it('returns a valid schema', async () => {
      const isValid = await validate(data);

      expect(isValid).toBe(true);
    });
    describe('returns false', () => {
      describe('loan value', () => {
        it('has value below than 30.000', async () => {
          data.loanValue = 29999;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
        it('not a number', async () => {
          data.loanValue = '29999';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('property', () => {
        it('has value below than 200.000', async () => {
          data.propertyValue = 190000;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
        it('not a number', async () => {
          data.propertyValue = '200000';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('loan motivation', () => {
        it('not an array', async () => {
          data.loanMotivation = 'PAY_OFF_DEBTS';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
        it('not in available options', async () => {
          data.loanMotivation = ['NONE'];
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('cpf', () => {
        it('has invalid length', async () => {
          data.cpf = '55';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('phone', () => {
        it('has invalid length', async () => {
          data.phone = '55 51 99999-9999';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('terms', () => {
        it('not in available options', async () => {
          data.terms = 220;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('email', () => {
        it('not an email', async () => {
          data.terms = 'test@';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('grace period', () => {
        it('not in available options', async () => {
          data.gracePeriod = 4;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('skip month', () => {
        it('not in available options', async () => {
          data.skipMonth = 13;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('age', () => {
        it('has less than 18', async () => {
          data.age = 17;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
        it('has more than 75', async () => {
          data.age = 76;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });

      describe('cep', () => {
        it('has invalid length', async () => {
          data.cep = '999999';
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
        it('has invalid type', async () => {
          data.cep = 999999300;
          const isValid = await validate(data);
          expect(isValid).toBe(false);
        });
      });
    });
  });
});
