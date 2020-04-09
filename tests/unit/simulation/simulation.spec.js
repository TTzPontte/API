const { simulation } = require('../../../src/simulation/simulation');
const Simulation = require('../../../src/layers/common/services/simulation.service');
const Calculator = require('../../../src/layers/common/services/calculator.service');
const Contract = require('../../../src/layers/common/services/contract.service');
const Cep = require('../../../src/layers/common/services/cep.service');

describe('simulation handler', () => {
  let event, calculatedResult, saveResult, address;
  beforeEach(() => {
    calculatedResult = { statusCode: 200, netLoan: 45000 };
    address = { status: 'OK' };
    saveResult = { id: '1' };
    Cep.getAddress = jest.fn(() => address);
    Calculator.calculate = jest.fn(() => calculatedResult);
    Simulation.save = jest.fn(() => saveResult);
    Simulation.isRegistered = jest.fn();
    Contract.isRegistered = jest.fn();

    event = {
      body: {
        loanValue: 68000,
        propertyValue: 310000,
        monthlyIncome: 6000,
        loanMotivation: ['RENOVATE_HOUSE', 'ANOTHER_REASON'],
        age: 27,
        cpf: '11122233344',
        phone: '+55 (99) 99999-9999',
        cep: '93347300',
        terms: 210,
        email: 'teste@gmail.com'
      },
      clientName: 'random-name',
      clientId: 'random-id',
      requestContext: {
        identity: {
          sourceIp: '127.0.0.1'
        }
      }
    };
  });

  it('return success', async () => {
    const expectedResult = {
      ...saveResult,
      simulation: { ...calculatedResult }
    };
    const response = await simulation(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual(expectedResult);
  });

  describe('when send invalid payload', () => {
    it('returns badRequest', async () => {
      delete event.body.loanValue;
      try {
        await simulation(event);
      } catch (error) {
        expect(error.message).toBe('Campos inválidos');
      }
    });
  });

  describe('when returns error on calculator', () => {
    it('returns badRequest', async () => {
      Calculator.calculate = jest.fn(() => ({ statusCode: 400 }));
      const response = await simulation(event);
      expect(response.statusCode).toBe(400);
    });
  });
});
