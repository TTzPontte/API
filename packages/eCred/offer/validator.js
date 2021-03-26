const yup = require('yup');
const createError = require('http-errors');
const { validateDocumentNumber } = require('common/helpers/validator');

let { INCOME_SOURCES, LOAN_MOTIVATION } = require('./constants');

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const validate = async fields => {
  const consumerSchema = yup.object({
    cpf: yup
      .string()
      .strict()
      .required()
      .documentNumber(),
    name: yup
      .string()
      .strict()
      .required(),
    birth_date: yup.date().required(),
    mother_name: yup
      .string()
      .strict()
      .required(),
    age: yup.number().required()
  });

  const questionsSchema = yup.object().shape({
    value: yup.number().required(),
    installments: yup
      .string()
      .strict()
      .required(),
    occupation: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .oneOf(INCOME_SOURCES)
          .required()
      })
      .required(),
    profession: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .required()
      })
      .required(),
    income: yup.number().required(),
    address_zip_code: yup
      .string()
      .strict()
      .required(),
    address: yup
      .string()
      .strict()
      .required(),
    address_number: yup
      .string()
      .strict()
      .required(),
    address_neighborhood: yup
      .string()
      .strict()
      .required(),
    address_city: yup
      .string()
      .strict()
      .required(),
    address_state: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .required(),
        value: yup
          .string()
          .strict()
          .required()
      })
      .required(),
    property_value: yup.number().required()
  });

  const schema = yup.object().shape({
    loanMotivation: yup.array().of(yup.string(LOAN_MOTIVATION).strict()),
    loanValue: yup.number().required(),
    terms: yup.number().required(),
    clientId: yup
      .string()
      .strict()
      .required()
  });

  try {
    const { clientId, loanMotivation, terms, loanValue, consumer, questions } = fields;
    await consumerSchema.validate(consumer);
    await questionsSchema.validate(questions);
    const isValid = await schema.validate({ clientId, loanMotivation, terms, loanValue });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateDocumentNumber };
