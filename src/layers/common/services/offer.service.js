const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const ContractModel = require('../models/contract');
const EntityModel = require('../models/entity');
const Entity = require('./entity.service');
const Process = require('./process.service');
const Contract = require(`${path}/services/contract.service`);
const Property = require('./property.service');
const User = require('./user.service');
const { getEntityByDocNumber } = require('../elasticsearch/entity.es');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwner: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const getLastEntity = async documentNumber => {
  return getEntityByDocNumber(documentNumber)[0];
};

const setEntityType = documentNumber => {
  return documentNumber.length === 14 ? 'PJ' : 'PF';
};

const save = async ({ entity, lastContract, ...data }) => {
  const { documentNumber } = entity;
  const { source, campaign } = lastContract;
  const entityType = setEntityType(documentNumber);
  const { id: contractOwner } = await Entity.save({ ...entity, type: entityType });

  const contract = new ContractModel({
    ...lastContract,
    ...data,
    contractOwner,
    contractOwners: [contractOwner],
    source,
    campaign
  });

  const savedContract = await contract.save();

  return savedContract;
};

const saveContract = async ({ entity, property, lastContract, lastEntity, secondPayers, ...data }) => {
  const Cognito = require('./cognito.service');

  const { name, email, phone, documentNumber } = entity;
  const { id, source, campaign, trackCode, simulation } = lastContract;
  const {
    parameters: { loanValue }
  } = simulation;

  const relations = await Contract.saveRelations({ ...entity });
  entity.relations = relations;

  const { User: cognitoUser } = await Cognito.createUser({ ...lastContract, ...simulation, loanValue, name, email, phone, documentNumber, id });
  const { id: propertyId } = await Property.save(property, trackCode);

  const updateEntity = new EntityModel({
    ...lastEntity,
    ...entity
  });

  const { id: contractOwner } = await updateEntity.save();

  await User.save({
    id: cognitoUser.Username,
    cpf: documentNumber,
    trackingCode: trackCode,
    entityId: contractOwner,
    campaign: campaign,
    source: source
  });

  const payers = Contract.getSecondPayers({ relations, secondPayers });

  const contract = new ContractModel({
    ...lastContract,
    ...data,
    propertyId,
    contractOwner,
    contractManager: contractOwner,
    contractOwners: [contractOwner],
    source,
    campaign,
    secondPayers: payers
  });

  const savedContract = await contract.save();

  await Process.save({
    contractId: savedContract.id,
    suites: property.suites,
    ...data
  });

  return savedContract;
};

module.exports = { save, saveContract, getContractByOwner, getLastEntity };
