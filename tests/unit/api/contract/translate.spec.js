const translate = require('api-src/api/contracts/translate');
const body = require('../../../utils/contractBody');

describe('Translate Contract', () => {
  let data;
  beforeEach(() => {
    data = body();
  });
  describe('translates', () => {
    describe('entity', () => {
      it('incomeSource', () => {
        const result = translate(data);
        expect(result.entity.incomeSource).toBe('ASSALARIADO');
        expect(result.entity.mother.incomeSource).toBe('ASSALARIADO');
      });

      it('educationLevel', () => {
        const result = translate(data);
        expect(result.entity.educationLevel).toBe('ENSINO SUPERIOR COMPLETO');
      });

      it('maritalStatus', () => {
        const result = translate(data);
        expect(result.entity.maritalStatus).toBe('CASADO');
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
