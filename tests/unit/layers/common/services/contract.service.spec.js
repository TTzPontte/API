const layerPath = '../../../../../src/layers/common/';
let { isRegistered, getContractByOwner, save } = require(`${layerPath}services/contract.service`);
const Entity = require(`${layerPath}services/entity.service`);
const Property = require(`${layerPath}services/property.service`);
const Cognito = require(`${layerPath}services/cognito.service`);
const Process = require(`${layerPath}services/process.service`);
const User = require(`${layerPath}services/user.service`);
const ContractModel = require(`${layerPath}models/contract`);
const translateBody = require('../../../../../src/contracts/translate');
const { getEntity } = require(`${layerPath}elasticsearch/entity.es`);
const body = require('../../../../utils/contractBody');

const faker = require('faker');

jest.mock('../../../../../src/layers/common/elasticsearch/entity.es');

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
    let email, documentNumber;
    beforeEach(() => {
      email = faker.internet.email();
      documentNumber = '12345678910';
    });
    it('returns false if not registered', async () => {
      getEntity.mockReturnValueOnce([]);

      expect(await isRegistered({ email, documentNumber })).toBe(false);
    });
    it('returns error if is registered', async () => {
      getEntity.mockReturnValueOnce([{ name: 'name' }]);
      try {
        await isRegistered({ email, documentNumber });
      } catch (error) {
        expect(error.message).toBe('Customer already exists');
      }
    });
  });

  describe('save contract', () => {
    it('saves contract correctly', async () => {
      const cognitoUser = { User: { Username: 'Test' } };
      const simulation = { terms: [0], installments: [0], parameters: { loanValue: 0 } };
      const {
        parameters: { loanValue }
      } = simulation;
      const id = '1';
      const lastContract = { id, trackCode: '12345', campaign: 'api', source: 'api', simulation };

      const { entity, property } = contract;
      const { name, email, phone, documentNumber } = entity;

      Entity.save = jest.fn(() => ({ id: '1' }));
      Property.save = jest.fn(() => ({ id: '1' }));
      Cognito.createUser = jest.fn(() => cognitoUser);
      User.save = jest.fn(() => ({ id: '1' }));
      global.mockModelSave = jest.fn(() => ({ id: 'contract-id-1' }));
      Process.save = jest.fn(() => ({ id: '1' }));

      const contract = translateBody(contract);

      await save({ ...contract, lastContract });
      expect(Cognito.createUser).toHaveBeenCalledWith({ ...lastContract, ...simulation, loanValue, name, email, phone, documentNumber, id });
      expect(User.save).toHaveBeenCalledWith({
        id: cognitoUser.User.Username,
        trackingCode: lastContract.trackCode,
        cpf: documentNumber,
        entityId: '1',
        campaign: lastContract.campaign,
        source: lastContract.source
      });
      expect(Entity.save).toHaveBeenCalledWith(entity);
      expect(Property.save).toHaveBeenCalledWith(property, '12345');

      delete contract.entity;
      delete contract.property;
      expect(Process.save).toHaveBeenCalledWith({ contractId: 'contract-id-1', suites: property.suites, ...contract });
      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
});
