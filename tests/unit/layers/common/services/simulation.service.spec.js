const layerPath = '../../../../../src/layers/common/';
const { getClientSimulation } = require(`${layerPath}elasticsearch/simulations.es`);
const { save, isRegistered, getLastSimulation } = require(`${layerPath}services/simulation.service`);
const SimulationModel = require(`${layerPath}models/simulation`);
const faker = require('faker');

jest.mock('../../../../../src/layers/common/elasticsearch/simulations.es');

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
      getClientSimulation.mockReturnValueOnce([]);

      expect(await isRegistered({ email, clientId, cpf })).toBe(false);
    });
    it('returns error if is registered', async () => {
      getClientSimulation.mockReturnValueOnce([{ name: 'name' }]);
      try {
        await isRegistered({ email, clientId, cpf });
      } catch (error) {
        expect(error.message).toBe('Cliente já cadastrado');
      }
    });
  });

  describe('getLastSimulation', () => {
    let simulation;
    beforeEach(() => {
      simulation = {
        parametros: {
          idade: '21',
          cep: '1312321',
          email: 'test@gmail.com',
          loanDate: '12321',
          rendaMensal: '321312',
          valImovel: '21312321',
          valorEmprestimo: '1231231',
          trackCode: '32213121'
        },
        id: '1',
        prazos: [{ foo: 'bar' }],
        parcelas: [[{ foo: 'bar' }]]
      };
    });

    it('returns simulation', async () => {
      const { id, parametros, parcelas, prazos } = simulation;
      const { idade, cep, email, loanDate, rendaMensal, valImovel, valorEmprestimo, trackCode, campaign, source } = parametros;
      const expectedResult = {
        id,
        age: idade,
        cep: cep,
        date: loanDate,
        installment: parcelas[0][0],
        loanValue: valorEmprestimo,
        loanValueSelected: valorEmprestimo,
        propertyValue: valImovel,
        rendaMensal: rendaMensal,
        term: prazos[0],
        email,
        trackCode,
        source,
        campaign
      };
      const exec = jest.fn(() => ({ ...simulation }));
      SimulationModel.queryOne = jest.fn(() => ({ exec }));

      expect(await getLastSimulation('2312312')).toStrictEqual(expectedResult);
    });
  });
});
