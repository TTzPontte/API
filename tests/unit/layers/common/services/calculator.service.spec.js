const layerPath = 'api-src/layers/common/';
const Invoke = require(`${layerPath}aws/invoke`);
const { calculate } = require(`${layerPath}services/calculator.service`);

describe('Calculator service', () => {
  describe('calculate', () => {
    beforeEach(() => {
      Invoke.invoke = jest.fn(() => ({ body: JSON.stringify({ success: true }) }));
    });
    it('invoke calculator function', async () => {
      const body = {
        loan_value: 68000,
        property_value: 310000,
        monthly_income: 6000,
        terms: 210
      };
      const data = { loanValue: 68000, propertyValue: 310000, monthlyIncome: 6000, terms: 210, gracePeriod: 0, skipMonth: 0 };
      await calculate(data);
      expect(Invoke.invoke).toHaveBeenCalledWith('SimulatorCalculatorFn', { body: JSON.stringify(body) });
    });
  });
});
