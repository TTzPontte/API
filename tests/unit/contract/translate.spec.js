const translate = require('../../../src/contracts/translate');
const body = require('../../utils/contractBody');

describe('Translate Contract', () => {
  let data;
  beforeEach(() => {
    data = body();
  });
  describe('translates', () => {
    describe('people', () => {
      it('incomeSource', () => {
        const result = translate(data);
        expect(result.people.incomeSource).toBe('ASSALARIADO');
        expect(result.people.mother.incomeSource).toBe('ASSALARIADO');
      });

      it('educationLevel', () => {
        const result = translate(data);
        expect(result.people.educationLevel).toBe('ENSINO SUPERIOR COMPLETO');
      });

      it('maritalStatus', () => {
        const result = translate(data);
        expect(result.people.maritalStatus).toBe('CASADO');
      });
    });

    describe('property', () => {
      it('type', () => {
        const result = translate(data);
        expect(result.property.type).toBe('Apartamento');
      });
      it('isResident', () => {
        const result = translate(data);
        expect(result.property.isResident).toBe('Próprio');
      });
    });
  });
});
