const layerPath = '../../../../../src/layers/common/';
let { save } = require(`${layerPath}services/property.service`);

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
  });
  it('saves property correctly', async () => {
    await save(property);

    expect(global.mockModelSave).toHaveBeenCalledTimes(1);
  });
});
