const { INCOME_SOURCES } = require('./constants');

const find = (obj, compare) => Object.keys(obj).find(item => compare === item);

const translate = ({ questions, consumer, ...body }) => {
  const source = find(INCOME_SOURCES, questions.ocupation.label);

  const translateConsumer = ({ consumer }) => {
    consumer.contactEmail = consumer.email;

    return {
      ...consumer,
      ...questions,
      incomeSource: source
    };
  };

  const translatedConsumer = translateConsumer({ consumer, questions });

  return {
    ...body,
    questions: questions,
    consumer: translatedConsumer
  };
};

module.exports = translate;
