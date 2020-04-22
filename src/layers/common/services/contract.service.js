const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getPeople } = require('../elasticsearch/people.es');
const Property = require('./property.service');
const People = require('./people.service');
const User = require('./user.service');
const Process = require('./process.service');

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

const save = async ({ people, property, lastSimulation, ...data }) => {
  const Cognito = require('./cognito.service');

  await isRegistered(people);
  const { name, email, phone, cpf } = people;
  const { id: simulationId, source, campaign, trackCode } = lastSimulation;

  const { User: cognitoUser } = await Cognito.createUser({ ...lastSimulation, name, email, phone, cpf, simulationId });

  const { id: contractOwner } = await People.save(people);
  const { id: propertyId } = await Property.save(property, trackCode);

  await User.save({
    id: cognitoUser.Username,
    trackingCode: trackCode,
    peopleId: contractOwner,
    campaign: campaign,
    source: source
  });

  const contract = new ContractModel({ ...data, propertyId, contractOwner, lastSimulation, source, campaign });
  const savedContract = await contract.save();

  await Process.save({
    contractId: savedContract.id,
    suites: property.suites,
    ...data
  });

  return savedContract;
};

module.exports = { save, isRegistered, getContractByOwner };
