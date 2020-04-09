const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getPeople } = require('../elasticsearch/people.es');
const Property = require('./property.service');
const People = require('./people.service');
const Simulation = require('../services/simulation.service');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwner: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const isRegistered = async ({ cpf, email }) => {
  const people = await getPeople({ cpf, email });

  if (people && people.length) {
    for (const person of people) {
      const contract = await getContractByOwner(person.id);
      if (contract && contract.length) {
        throw new createError.BadRequest('Cliente já cadastrado');
      }
    }
  }
  return false;
};

const save = async ({ people, property, simulationId, ...data }) => {
  const { id: contractOwner } = await People.save(people);
  const { id: propertyId } = await Property.save(property);
  const lastSimulation = await Simulation.getLastSimulation(simulationId);

  const contract = new ContractModel({ ...data, propertyId, contractOwner, lastSimulation });
  return contract.save();
};

module.exports = { save, isRegistered, getContractByOwner };
