const layerPath = '../../../../src/layers/common/';
const { isRegistered, getContractByOwner } = require(`${layerPath}services/contract.service`);
const ContractModel = require(`${layerPath}models/contract`);
const { getPeople } = require(`${layerPath}elasticsearch/people.es`);
const faker = require('faker');

jest.mock('../../../../src/layers/common/elasticsearch/people.es');

describe('Contract service', () => {
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
});
