const Property = require('../models/property');

const save = async data => {
  const property = new Property({ ...data });
  return property.save();
};

module.exports = { save };
