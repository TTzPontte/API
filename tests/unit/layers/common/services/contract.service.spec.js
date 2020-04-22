const layerPath = '../../../../../src/layers/common/';
let { isRegistered, getContractByOwner, save } = require(`${layerPath}services/contract.service`);
const People = require(`${layerPath}services/people.service`);
const Property = require(`${layerPath}services/property.service`);
const Cognito = require(`${layerPath}services/cognito.service`);
const Process = require(`${layerPath}services/process.service`);
const User = require(`${layerPath}services/user.service`);
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
        expect(error.message).toBe('Customer already exists');
      }
    });
  });

  describe('save contract', () => {
    it('saves contract correctly', async () => {
      const cognitoUser = { User: { Username: 'Test' } };
      const lastSimulation = { id: '1', trackCode: '12345', campaign: 'api', source: 'api' };

      const { people, property } = contract;
      const { name, email, phone, cpf } = people;

      People.save = jest.fn(() => ({ id: '1' }));
      Property.save = jest.fn(() => ({ id: '1' }));
      Cognito.createUser = jest.fn(() => cognitoUser);
      User.save = jest.fn(() => ({ id: '1' }));
      global.mockModelSave = jest.fn(() => ({ id: 'contract-id-1' }));
      Process.save = jest.fn(() => ({ id: '1' }));

      await save({ ...contract, lastSimulation });
      expect(Cognito.createUser).toHaveBeenCalledWith({ ...lastSimulation, name, email, phone, cpf, simulationId: lastSimulation.id });
      expect(User.save).toHaveBeenCalledWith({
        id: cognitoUser.User.Username,
        trackingCode: lastSimulation.trackCode,
        peopleId: '1',
        campaign: lastSimulation.campaign,
        source: lastSimulation.source
      });
      expect(People.save).toHaveBeenCalledWith(people);
      expect(Property.save).toHaveBeenCalledWith(property, '12345');

      delete contract.people;
      delete contract.property;
      expect(Process.save).toHaveBeenCalledWith({ contractId: 'contract-id-1', suites: property.suites, ...contract });
      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
});
