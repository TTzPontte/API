const { validate, isValidCep, isCovered } = require('../../../src/simulation/validator');

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
    it('not throw', async () => {
      expect(async () => validate(data)).not.toThrow();
    });
    describe('throws error when', () => {
      describe('loan value', () => {
        it('has value below than 30.000', async () => {
          data.loanValue = 29999;
          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
        it('not a number', async () => {
          data.loanValue = '29999';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('property', () => {
        it('has value below than 200.000', async () => {
          data.propertyValue = 190000;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
        it('not a number', async () => {
          data.propertyValue = '200000';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('loan motivation', () => {
        it('not an array', async () => {
          data.loanMotivation = 'PAY_OFF_DEBTS';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
        it('not in available options', async () => {
          data.loanMotivation = ['NONE'];

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('cpf', () => {
        it('has invalid length', async () => {
          data.cpf = '55';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('phone', () => {
        it('has invalid length', async () => {
          data.phone = '55 51 99999-9999';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('terms', () => {
        it('not in available options', async () => {
          data.terms = 220;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('email', () => {
        it('not is an email', async () => {
          data.terms = 'test@';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('grace period', () => {
        it('not in available options', async () => {
          data.gracePeriod = 4;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('skip month', () => {
        it('not in available options', async () => {
          data.skipMonth = 13;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('age', () => {
        it('has less than 18', async () => {
          data.age = 17;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
        it('has more than 75', async () => {
          data.age = 76;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });

      describe('cep', () => {
        it('has invalid length', async () => {
          data.cep = '999999';

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
        it('has invalid type', async () => {
          data.cep = 999999300;

          try {
            await validate(data);
          } catch (error) {
            expect(error.message).toBe('Campos inválidos');
          }
        });
      });
    });
  });

  describe('isValidCep', () => {
    it('returns true if address is valid', async () => {
      const address = { status: 'OK' };

      expect(await isValidCep(address)).toBe(true);
    });
    it('throws invalid cep error', async () => {
      const address = { status: 'INVALID' };

      try {
        await isValidCep(address);
      } catch (error) {
        expect(error.message).toBe('Cep inválido');
      }
    });
  });
  describe('isCovered', () => {
    it('returns true if is covered', async () => {
      const address = { status: 'OK' };

      expect(await isCovered(address)).toBe(true);
    });
    it('returns false if is not covered', async () => {
      const address = { status: 'NOK' };
      expect(await isCovered(address)).toBe(false);
    });
  });
});
