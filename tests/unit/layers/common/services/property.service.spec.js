const { save } = require('common/services/property.service');
const { getAddress, isCovered, isValidCep } = require('common/services/cep.service');

jest.mock('common/services/cep.service');

describe('save property', () => {
  let property;
  beforeEach(() => {
    property = {
      address: {},
      age: '<=2',
      bedrooms: '3',
      financed: 'Não',
      floorArea: '400 m²',
      haveRegistration: 'Não',
      isResident: 'Próprio',
      owners: [],
      suites: '1',
      type: 'Apartamento'
    };
    getAddress.mockReturnValueOnce([]);
    isValidCep.mockReturnValueOnce(true);
    isCovered.mockReturnValueOnce(true);
  });
  it('saves property correctly', async () => {
    await save(property);
    expect(global.mockModelSave).toHaveBeenCalledTimes(1);
  });
});
