const People = require('../models/people');
const _ = require('lodash');

const save = async data => {
  let personas = ['mother', 'father', 'spouse', 'sibling', 'child'];

  personas = await personas.reduce(async (previousPromise, persona) => {
    const obj = await previousPromise;
    if (data[persona] && !_.isEmpty(data[persona])) {
      const people = new People({ ...data[persona] });
      const person = await people.save();
      return { ...obj, [persona]: { ...person } };
    }
    return obj;
  }, Promise.resolve({}));

  const people = new People({ ...data, ...personas });
  return people.save();
};

module.exports = { save };
