const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const _ = require(`${path}/node_modules/lodash`);
const { EDUCATION_LEVELS, MARITAL_STATUS, PERSONAS, PROPERTY_TYPES, INCOME_SOURCES, RESIDENTS } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const BOOL_VALUES = ['children', 'secondPayer', 'liveInProperty', 'hasSiblings'];

const translate = ({ entity, property, secondPayers, ...body }) => {
  const translateBoolValue = (obj, value) => ({ ...obj, [value]: entity[value] ? 'Sim' : 'Não' });
  const level = find(EDUCATION_LEVELS, entity.about.educationLevel);
  const marital = find(MARITAL_STATUS, entity.about.maritalStatus);
  const type = find(PROPERTY_TYPES, property.type);
  const source = find(INCOME_SOURCES, entity.incomeSource);
  const resident = find(RESIDENTS, property.isResident);

  const translateRelations = entity.relations.map((relation) => {
    const relations = [];
    Object.keys(relation).map((personas) => {
      const person = find(PERSONAS, personas);  
      const persona = relation[person];
      const incomeSource = find(INCOME_SOURCES, persona.incomeSource);  
      persona.relation = PERSONAS[person];
      persona.incomeSource = INCOME_SOURCES[incomeSource];
      relations.push(persona)
    });
  
    return relations[0];
  });
  
  const translatedSecondPayers = secondPayers.map((secondPayer) => {
    const persona = find(PERSONAS, secondPayer);
    return PERSONAS[persona]
  });

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

  const translateEntity = (entity) => {
    entity.about.educationLevel = EDUCATION_LEVELS[level];
    entity.about.maritalStatus = MARITAL_STATUS[marital];
    entity.relations = translateRelations;
    entity.contactEmail = entity.email;
    
    return {
      ...entity,
      ...personas,
      ...boolValues,
      incomeSource: INCOME_SOURCES[source]
    }
  };
  
  const translatedEntity = translateEntity(entity)
  
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
    secondPayers: translatedSecondPayers
  };
};

module.exports = translate;
