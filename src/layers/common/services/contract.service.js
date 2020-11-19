const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getEntity } = require('../elasticsearch/entity.es');
const Property = require('./property.service');
const Entity = require('./entity.service');
const User = require('./user.service');
const Process = require('./process.service');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwners: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const isRegistered = async ({ email, documentNumber }) => {
  const entity = await getEntity({ email, documentNumber });

  if (entity && entity.length) {
    for (const person of entity) {
      console.log('person', person);
      const contract = await getContractByOwner(person.id);
      if (contract && contract.length) {
        throw new createError.Conflict('Customer already exists');
      }
    }
  }
  return false;
};

const save = async ({ entity, property, lastContract, ...data }) => {
  const Cognito = require('./cognito.service');

  await isRegistered(entity);
  const { name, email, phone, documentNumber } = entity;
  const { id, source, campaign, trackCode, simulation } = lastContract;
  const {
    parameters: { loanValue }
  } = simulation;

  const { User: cognitoUser } = await Cognito.createUser({ ...lastContract, ...simulation, loanValue, name, email, phone, documentNumber, id });

  const { id: contractOwner } = await Entity.save(entity);
  const { id: propertyId } = await Property.save(property, trackCode);

  await User.save({
    id: cognitoUser.Username,
    trackingCode: trackCode,
    peopleId: contractOwner,
    campaign: campaign,
    source: source
  });

  const contract = new ContractModel({ ...lastContract, ...data, propertyId, contractOwner, source, campaign });
  const savedContract = await contract.save();

  await Process.save({
    contractId: savedContract.id,
    suites: property.suites,
    ...data
  });

  return savedContract;
};

module.exports = { save, isRegistered, getContractByOwner };
