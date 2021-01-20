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

const setRelations = entity => {
  const relationsList = [];
  const relations = entity.relations;
  relations.map(relation => {
    const relationType = setEntityType(relation.cpf);
    const relationFormated = {
      documentNumber: relation.cpf,
      birth: relation.birth,
      email: relation.email,
      contactEmail: relation.email,
      name: relation.name,
      relation: relation.relation,
      income: [
        {
          incomeSource: relation.incomeSource
        }
      ],
      type: relationType
    };
    relationsList.push(relationFormated);
  });
  return relationsList;
};

const saveRelations = async entity => {
  const relationsList = [];
  const relations = setRelations(entity);
  for (const relation of relations) {
    const relat = await Entity.save(relation);
    const rel = {
      type: [relation.relation],
      id: relat.id
    };
    relationsList.push(rel);
  }
  return relationsList;
};

const getSecondPayers = ({ relations, secondPayers }) => {
  const secondPayerList = [];
  for (const persona of secondPayers) {
    for (const relation of relations) {
      if (relation.type[0] === persona) {
        secondPayerList.push(relation.id);
      }
    }
  }
  return secondPayerList;
};

const save = async ({ entity, property, lastContract, secondPayers, ...data }) => {
  await isRegistered(entity);
  const { documentNumber } = entity;
  const { source, campaign, trackCode } = lastContract;

  const entityType = setEntityType(documentNumber);

  const relations = await saveRelations({ ...entity, type: entityType });
  entity.relations = relations;
  entity.income = [entity.income];

  const { id: contractOwner } = await Entity.save({ ...entity, type: entityType });
  const { id: propertyId } = await Property.save(property, trackCode);

  await User.save({
    id: documentNumber,
    cpf: documentNumber,
    trackingCode: trackCode,
    entityId: contractOwner,
    campaign: campaign,
    source: source
  });

  const payers = getSecondPayers({ relations, secondPayers });

  const contract = new ContractModel({
    ...lastContract,
    ...data,
    propertyId,
    contractOwner,
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

module.exports = { save, isRegistered, getContractByOwner };
