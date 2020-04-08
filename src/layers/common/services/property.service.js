const Property = require('../models/property');

const save = async data => {
  const property = new Property({ ...data });
  return await property.save();
};

module.exports = { save };
