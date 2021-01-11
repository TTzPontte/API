const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const _ = require(`${path}/node_modules/lodash`);
const { EDUCATION_LEVELS, MARITAL_STATUS, PERSONAS, PROPERTY_TYPES, INCOME_SOURCES, RESIDENTS } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const BOOL_VALUES = ['children', 'secondPayer', 'liveInProperty', 'hasSiblings'];

const translate = ({ people, property, whoIsSecondPayer, ...body }) => {
  const translateBoolValue = (obj, value) => ({ ...obj, [value]: people[value] ? 'Sim' : 'Não' });
  const level = find(EDUCATION_LEVELS, people.educationLevel);
  const marital = find(MARITAL_STATUS, people.maritalStatus);
  const type = find(PROPERTY_TYPES, property.type);
  const persona = find(PERSONAS, whoIsSecondPayer);
  const source = find(INCOME_SOURCES, people.incomeSource);
  const resident = find(RESIDENTS, property.isResident);

  const boolValues = BOOL_VALUES.reduce(translateBoolValue, {});

  const personas = Object.keys(PERSONAS).reduce((obj, person) => {
    if (people[person] && !_.isEmpty(people[person])) {
      const { incomeSource } = people[person];
      return {
        ...obj,
        [person]: {
          ...people[person],
          incomeSource: INCOME_SOURCES[find(INCOME_SOURCES, incomeSource)]
        }
      };
    }
    return obj;
  }, {});

  const translatedPeople = {
    ...people,
    ...personas,
    ...boolValues,
    educationLevel: EDUCATION_LEVELS[level],
    maritalStatus: MARITAL_STATUS[marital],
    incomeSource: INCOME_SOURCES[source]
  };

  const translatedProperty = {
    ...property,
    type: PROPERTY_TYPES[type],
    isResident: RESIDENTS[resident],
    financed: property.finance ? 'Sim' : 'Não'
  };

  return {
    ...body,
    people: translatedPeople,
    property: translatedProperty,
    whoIsSecondPayer: PERSONAS[persona]
  };
};

module.exports = translate;
