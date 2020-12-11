const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const _ = require(`${path}/node_modules/lodash`);
const { EDUCATION_LEVELS, MARITAL_STATUS, PERSONAS, PROPERTY_TYPES, INCOME_SOURCES, RESIDENTS } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const BOOL_VALUES = ['children', 'secondPayer', 'liveInProperty', 'hasSiblings'];

const translate = ({ entity, property, secondPayers, ...body }) => {
  const translateBoolValue = (obj, value) => ({ ...obj, [value]: entity[value] ? 'Sim' : 'Não' });
  const level = find(EDUCATION_LEVELS, entity.educationLevel);
  const marital = find(MARITAL_STATUS, entity.maritalStatus);
  const type = find(PROPERTY_TYPES, property.type);
  const persona = find(PERSONAS, secondPayers);
  console.log('persona -> ', persona);
  const source = find(INCOME_SOURCES, entity.incomeSource);
  const resident = find(RESIDENTS, property.isResident);

  const boolValues = BOOL_VALUES.reduce(translateBoolValue, {});

  const personas = Object.keys(PERSONAS).reduce((obj, person) => {
    if (entity[person] && !_.isEmpty(entity[person])) {
      const { incomeSource } = entity[person];
      return {
        ...obj,
        [person]: {
          ...entity[person],
          incomeSource: INCOME_SOURCES[find(INCOME_SOURCES, incomeSource)]
        }
      };
    }
    return obj;
  }, {});

  const translatedEntity = {
    ...entity,
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
    entity: translatedEntity,
    property: translatedProperty,
    secondPayers: PERSONAS[persona]
  };
};

module.exports = translate;
