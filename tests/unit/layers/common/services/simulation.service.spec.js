const layerPath = '../../../../../src/layers/common/';
const { getClientContract } = require(`${layerPath}elasticsearch/contractsReport.es`);
const { save, isRegistered, getLastContract } = require(`${layerPath}services/simulation.service`);
const ContractModel = require(`${layerPath}models/contract`);
const faker = require('faker');

jest.mock('../../../../../src/layers/common/elasticsearch/contractsReport.es');

describe('Simulation service', () => {
  describe('save', () => {
    it('saves the simulation', async () => {
      const data = {
        loanValue: 35000,
        propertyValue: 250000,
        monthlyIncome: 25000,
        terms: 180,
        age: 27,
        cep: '00000000',
        email: faker.internet.email(),
        phone: '+55 (99) 99999-9999',
        trackCode: faker.random.uuid(),
        loanMotivation: ['RENOVATE_HOUSE'],
        gracePeriod: 0,
        skipMonth: 0,
        sourceIp: faker.internet.ip(),
        clientId: faker.random.uuid()
      };
      const calculated = { netLoan: 38000, grossLoan: 45000, installment: [{ installment: 1200 }], ltv: 0.3, ltvMax: 0.5, cet: 0.03 };

      await save({ data, calculated });

      expect(global.mockModelSave).toHaveBeenCalledTimes(1);
    });
  });
  describe('isRegistered', () => {
    let email, clientId, cpf;
    beforeEach(() => {
      email = faker.internet.email();
      clientId = faker.random.uuid();
      cpf = '00011122233';
    });
    it('returns false if not registered', async () => {
      getClientContract.mockReturnValueOnce([]);

      expect(await isRegistered({ email, clientId, cpf })).toBe(false);
    });
    it('returns error if is registered', async () => {
      getClientContract.mockReturnValueOnce([{ name: 'name' }]);
      try {
        await isRegistered({ email, clientId, cpf });
      } catch (error) {
        expect(error.message).toBe('Customer already exists');
      }
    });
  });

  describe('getLastContract', () => {
    let contract;
    beforeEach(() => {
      contract = {
        simulation: {
          parameters: {
            age: '21',
            cep: '1312321',
            email: 'test@gmail.com',
            loanDate: '12321',
            monthlyIncome: '321312',
            propertyValue: '21312321',
            loanValue: '1231231'
          },
          terms: [{ foo: 'bar' }],
          installments: [[{ foo: 'bar' }]],
          loanValueSelected: '1231231'
        },
        id: '1',
        trackCode: '32213121'
      };
    });

    it('returns simulation', async () => {
      const exec = jest.fn(() => ({ ...contract }));
      ContractModel.queryOne = jest.fn(() => ({ exec }));

      expect(await getLastContract('2312312')).toStrictEqual(contract);
    });
  });
});
