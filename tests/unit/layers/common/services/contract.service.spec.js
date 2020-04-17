const layerPath = '../../../../../src/layers/common/';
let { isRegistered, getContractByOwner, save } = require(`${layerPath}services/contract.service`);
const People = require(`${layerPath}services/people.service`);
const Property = require(`${layerPath}services/property.service`);
const ContractModel = require(`${layerPath}models/contract`);
const { getPeople } = require(`${layerPath}elasticsearch/people.es`);
const body = require('../../../../utils/contractBody');

const faker = require('faker');

jest.mock('../../../../../src/layers/common/elasticsearch/people.es');

describe('Contract service', () => {
  let contract;
  beforeEach(() => {
    contract = body();
  });
  describe('get contract by contract owner', () => {
    it('should return the contract', async () => {
      const contractOwner = faker.random.uuid();
      const result = 'Contract';
      const exec = jest.fn(() => result);
      const using = jest.fn(() => ({ exec }));
      ContractModel.query = jest.fn(() => ({ using }));

      const response = await getContractByOwner(contractOwner);

      expect(ContractModel.query).toHaveBeenCalledWith({ contractOwner: { eq: contractOwner } });
      expect(using).toHaveBeenCalledWith('ContractByOwner');
      expect(exec).toHaveBeenCalledTimes(1);
      expect(response).toEqual(result);
    });
  });

  describe('verifies if is registered', () => {
    let email, cpf;
    beforeEach(() => {
      email = faker.internet.email();
      cpf = '12345678910';
    });
    it('returns false if not registered', async () => {
      getPeople.mockReturnValueOnce([]);

      expect(await isRegistered({ email, cpf })).toBe(false);
    });
    it('returns error if is registered', async () => {
      getPeople.mockReturnValueOnce([{ name: 'name' }]);
      try {
        await isRegistered({ email, cpf });
      } catch (error) {
        expect(error.message).toBe('Cliente já cadastrado');
      }
    });
  });

  describe('save contract', () => {
    it('saves contract correctly', async () => {
      People.save = jest.fn(() => ({ id: '1' }));
      Property.save = jest.fn(() => ({ id: '1' }));

      await save({ ...contract, lastSimulation: { trackCode: '12345' } });
      expect(People.save).toHaveBeenCalledWith(contract.people);
      expect(Property.save).toHaveBeenCalledWith(contract.property, '12345');
      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
});
