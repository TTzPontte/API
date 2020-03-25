const { validate } = require('./validator');
const { parser } = require('./parser');
const Simulation = require('/opt/services/simulation.service');
const Calculator = require('/opt/services/calculator.service');
const { success, badRequest } = require('/opt/lambda/response');

const handler = async (event, context) => {
  const data = await parser(event);
  const isValid = await validate(data);
  if (isValid) {
    const calculated = await Calculator.calculate(data);

    if (calculated.statusCode !== 400) {
      const simulation = await Simulation.save({ data, calculated });

      const response = {
        id: simulation.id,
        simulation: calculated
      };

      return success({ ...response });
    }
  }

  return badRequest('Algo deu errado');
};

module.exports = { handler };
