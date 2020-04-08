const createError = require('http-errors');
const ContractModel = require('../models/contract');
const { getPeople } = require('../elasticsearch/people.es');

const getContractByOwner = async contractOwner => {
  return await ContractModel.query({ contractOwner: { eq: contractOwner } })
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

module.exports = { isRegistered, getContractByOwner };
