const yup = require('yup');
const createError = require('http-errors');
const { validateDocumentNumber } = require('common/helpers/validator');

let {
  MIN_PROPERTY_VALUE,
  MIN_AGE,
  MAX_AGE,
  TERMS,
  MIN_LOAN_VALUE,
  LOAN_MOTIVATION,
  GRACE_PERIOD,
  MAX_LOAN_VALUE,
  PHONE_REG_EXP
} = require('./constants');

LOAN_MOTIVATION = Object.keys(LOAN_MOTIVATION);

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const validate = async fields => {
  const schema = yup.object().shape({
    loanValue: yup
      .number()
      .min(MIN_LOAN_VALUE)
      .max(MAX_LOAN_VALUE)
      .required(),
    propertyValue: yup
      .number()
      .min(MIN_PROPERTY_VALUE)
      .required(),
    monthlyIncome: yup.number().required(),
    age: yup
      .number()
      .min(MIN_AGE)
      .max(MAX_AGE)
      .default(MIN_AGE)
      .required(),
    documentNumber: yup
      .string()
      .strict()
      .length(11)
      .required()
      .documentNumber(),
    phone: yup
      .string()
      .matches(PHONE_REG_EXP)
      .strict()
      .required(),
    cep: yup
      .string()
      .strict()
      .length(8),
    terms: yup
      .number()
      .oneOf(TERMS)
      .required(),
    email: yup
      .string()
      .strict()
      .email()
      .required(),
    loanMotivation: yup
      .default([])
      .array()
      .of(yup.string().oneOf(LOAN_MOTIVATION)),
    gracePeriod: yup
      .number()
      .oneOf(GRACE_PERIOD)
      .notRequired(),
    skipMonth: yup
      .number()
      .max(12)
      .notRequired()
  });

  try {
    const isValid = await schema.validate(fields);
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate };
