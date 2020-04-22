const createError = require('http-errors');
const Property = require('../models/property');
const { getAddress, isCovered, isValidCep } = require('./cep.service');

const save = async (data, trackCode) => {
  const address = await getAddress({ cep: data.address.cep, trackCode });
  isValidCep(address);

  if (isCovered(address)) {
    const property = new Property({ ...data });
    return property.save();
  }

  return createError.BadRequest('Region not supported');
};

module.exports = { save };
