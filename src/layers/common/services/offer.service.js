const ContractModel = require('../models/contract');
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

  await Process.save({
    contractId: savedContract.id,
    ...data
  });

  return savedContract;
};

module.exports = { save, getContractByOwner };
