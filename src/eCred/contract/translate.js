const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const _ = require(`${path}/node_modules/lodash`);
const { PERSONAS, PROPERTY_TYPES, INCOME_SOURCES, RESIDENTS } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const BOOL_VALUES = ['secondPayer'];

const translate = ({ questions, consumer, ...body }) => {
  const translateBoolValue = (obj, value) => ({ ...obj, [value]: questions[value] ? 'Sim' : 'Não' });
  const type = find(PROPERTY_TYPES, questions.property.type);
  const source = find(INCOME_SOURCES, questions.ocupation.label);
  const resident = find(RESIDENTS, questions.property.isResident);

  const boolValues = BOOL_VALUES.reduce(translateBoolValue, {});

  const personas = Object.keys(PERSONAS).reduce((obj, person) => {
    if (consumer[person] && !_.isEmpty(consumer[person])) {
      const { label: incomeSource } = consumer[person].questions.ocupation;
      return {
        ...obj,
        [person]: {
          ...consumer[person],
          incomeSource: source
        }
      };
    }
    return obj;
  }, {});

  const translateConsumer = ({ consumer }) => {
    consumer.contactEmail = consumer.email;

    return {
      ...consumer,
      ...questions,
      ...personas,
      ...boolValues,
      incomeSource: source
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
    questions: questions,
    consumer: translatedConsumer,
    property: translatedProperty
  };
};

module.exports = translate;
