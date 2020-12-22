const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getEntity } = require('../elasticsearch/entity.es');
const Property = require('./property.service');
const Entity = require('./entity.service');
const User = require('./user.service');
const Process = require('./process.service');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwner: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const setEntityType = documentNumber => {
  return documentNumber.length === 14 ? "PJ" : "PF";
};

const isRegistered = async ({ email, documentNumber }) => {
  const entity = await getEntity({ email, documentNumber });

  if (entity && entity.length) {
    for (const person of entity) {
      const contract = await getContractByOwner(person.id);
      if (contract && contract.length) {
        throw new createError.Conflict('Customer already exists');
      }
    }
  }
  return false;
};

const getRelations = entity => {
  console.log('entity -> ', entity);
  const fotmatRelations = entity.relations.map((relation) => {
    console.log('relation -> ', relation);
  });
};

const save = async ({ entity, property, lastContract, secondPayers, ...data }) => {
  const Cognito = require('./cognito.service');
  getRelations(entity);

  await isRegistered(entity);
  const { name, email, phone, documentNumber } = entity;
  const { id, source, campaign, trackCode, simulation } = lastContract;
  const {
    parameters: { loanValue }
  } = simulation;

  const entityType = setEntityType(documentNumber);

  const { User: cognitoUser } = await Cognito.createUser({ ...lastContract, ...simulation, loanValue, name, email, phone, documentNumber, id });
  const { id: contractOwner } = await Entity.save({ ...entity, type: entityType });
  const { id: propertyId } = await Property.save(property, trackCode);

  await User.save({
    id: cognitoUser.Username,
    cpf: documentNumber,
    trackingCode: trackCode,
    entityId: contractOwner,
    campaign: campaign,
    source: source
  });

  const { STATUS_GROUP_DEFAULT_ID } = process.env;

  const contract = new ContractModel({ 
    ...lastContract, 
    ...data, 
    propertyId, 
    contractManager: contractOwner, 
    contractOwners: [contractOwner], 
    source, 
    campaign, 
    secondPayers, 
    statusGroupContractId: STATUS_GROUP_DEFAULT_ID
  });
  
  const savedContract = await contract.save();

  await Process.save({
    contractId: savedContract.id,
    suites: property.suites,
    ...data
  });

  return savedContract;
};

module.exports = { save, isRegistered, getContractByOwner };
