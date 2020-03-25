const { invoke } = require('/opt/aws/invoke');

const calculate = async ({ loanValue, propertyValue, monthlyIncome, terms, gracePeriod, skipMonth }) => {
  const payload = {
    loan_value: loanValue,
    property_value: propertyValue,
    monthly_income: monthlyIncome,
    terms: terms,
    grace_period: gracePeriod,
    skip_month: skipMonth,
    day_due: 5,
    interest_rate: 0.85
  };

  if (!skipMonth) delete payload.skip_month;
  if (!gracePeriod) delete payload.grace_period;

  const body = JSON.stringify(payload);

  const response = await invoke('SimulatorCalculatorFn', { body });

  return JSON.parse(response.body);
};

module.exports = { calculate };
