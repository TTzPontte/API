const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const { validate } = require('./validator');
const { parser } = require('./parser');
const { success, badRequest } = require(`${path}/lambda/response`);
const Simulation = require(`${path}/services/simulation.service`);
const Calculator = require(`${path}/services/calculator.service`);
const middy = require(`${path}/middy/middy`);

const handler = async event => {
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

module.exports = { handler: middy(handler) };
