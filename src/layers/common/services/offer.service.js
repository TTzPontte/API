const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getEntity } = require('../elasticsearch/entity.es');
const Entity = require('./entity.service');
const Process = require('./process.service');

const getContractByOwner = async contractOwner => {
  return ContractModel.query({ contractOwner: { eq: contractOwner } })
    .using('ContractByOwner')
    .exec();
};

const setEntityType = documentNumber => {
  return documentNumber.length === 14 ? 'PJ' : 'PF';
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

const save = async ({ entity, lastContract, ...data }) => {
  await isRegistered(entity);

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

  await Process.save({
    contractId: savedContract.id,
    ...data
  });

  return savedContract;
};

module.exports = { save, isRegistered, getContractByOwner };
