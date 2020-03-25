const { simulation } = require('../../../src/simulation/simulation');
const Simulation = require('../../../src/layers/common/services/simulation.service');
const Calculator = require('../../../src/layers/common/services/calculator.service');

describe('simulation handler', () => {
  let event, calculatedResult, saveResult;
  beforeEach(() => {
    calculatedResult = { statusCode: 200, netLoan: 45000 };
    saveResult = { id: '1' };
    Calculator.calculate = jest.fn(() => calculatedResult);
    Simulation.save = jest.fn(() => saveResult);

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
      const response = await simulation(event);
      expect(response.statusCode).toBe(400);
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
