const ContractModel = require('../models/contract');
const PropertytModel = require('../models/property');
const EntityModel = require('../models/entity');
const Entity = require('./entity.service');
const Process = require('./process.service');
const { getEntityByDocNumber } = require('../elasticsearch/entity.es');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwner: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const getLastEntity = async documentNumber => {
  return getEntityByDocNumber(documentNumber);
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
    contractOwner: contractOwner,
    contractOwners: [contractOwner],
    source: source || 'ecred',
    campaign
  });

  const savedContract = await contract.save();

  return savedContract;
};

const saveContract = async ({ entity, lastContract, lastEntity, ...data }) => {
  const { source, campaign } = lastContract;

  const updateEntity = new EntityModel({
    ...lastEntity[0],
    ...entity
  });

  const { id: contractOwner } = await updateEntity.save();

  const property = new PropertytModel();
  const { id: propertyId } = await property.save();

  const contract = new ContractModel({
    ...lastContract,
    ...data,
    propertyId,
    contractManager: contractOwner,
    contractOwner: contractOwner,
    contractOwners: [contractOwner],
    source,
    campaign,
    priorization: 'fast'
  });

  const savedContract = await contract.save();

  await Process.save({
    contractId: savedContract.id,
    ...data
  });

  return savedContract;
};

module.exports = { save, saveContract, getContractByOwner, getLastEntity };
