const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const _ = require(`${path}/node_modules/lodash`);
const { EDUCATION_LEVELS, MARITAL_STATUS, PERSONAS, PROPERTY_TYPES, INCOME_SOURCES, RESIDENTS } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const BOOL_VALUES = ['secondPayer'];

const translate = ({ questions, consumer, ...body }) => {
  const translateBoolValue = (obj, value) => ({ ...obj, [value]: questions[value] ? 'Sim' : 'Não' });
  const level = find(EDUCATION_LEVELS, consumer.education_level);
  const marital = find(MARITAL_STATUS, consumer.marital_status);
  const type = find(PROPERTY_TYPES, questions.property.type);
  const source = find(INCOME_SOURCES, questions.ocupation.label);
  const resident = find(RESIDENTS, questions.property.isResident);

  const translateRelations = questions.relations.map(relation => {
    const relations = [];
    Object.keys(relation).map(personas => {
      const person = find(PERSONAS, personas);
      const persona = relation[person];
      const incomeSource = find(INCOME_SOURCES, persona.ocupation.label);
      persona.relation = PERSONAS[person];
      persona.ocupation.label = INCOME_SOURCES[incomeSource];
      relations.push(persona);
    });

    return relations[0];
  });

  const translatedSecondPayers = questions.secondPayers.map(secondPayer => {
    const persona = find(PERSONAS, secondPayer);
    return PERSONAS[persona];
  });

  const boolValues = BOOL_VALUES.reduce(translateBoolValue, {});

  const personas = Object.keys(PERSONAS).reduce((obj, person) => {
    if (consumer[person] && !_.isEmpty(consumer[person])) {
      const { label: incomeSource } = consumer[person].questions.ocupation;
      return {
        ...obj,
        [person]: {
          ...consumer[person],
          incomeSource: INCOME_SOURCES[find(INCOME_SOURCES, incomeSource)]
        }
      };
    }
    return obj;
  }, {});

  const translateConsumer = ({ consumer, questions }) => {
    consumer.education_level = EDUCATION_LEVELS[level];
    consumer.marital_status = MARITAL_STATUS[marital];
    questions.relations = translateRelations;
    consumer.contactEmail = consumer.email;

    return {
      ...consumer,
      ...personas,
      ...boolValues,
      incomeSource: INCOME_SOURCES[source]
    };
  };

  const translatedConsumer = translateConsumer({ consumer, questions });

  const translatedProperty = {
    ...questions.property,
    type: PROPERTY_TYPES[type],
    isResident: RESIDENTS[resident],
    financed: questions.property.finance ? 'Sim' : 'Não'
  };

  return {
    ...body,
    consumer: translatedConsumer,
    questions: translatedProperty,
    secondPayers: translatedSecondPayers
  };
};

module.exports = translate;
