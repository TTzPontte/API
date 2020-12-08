const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const createError = require(`${path}/node_modules/http-errors`);
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
const { validateDocumentNumber } = require(`${path}/helpers/validator`);

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const validate = async fields => {
  const schema = yup.object().shape({
    loanValue: yup
      .number()
      .moreThan(MIN_LOAN_VALUE)
      .max(MAX_LOAN_VALUE)
      .required(),
    propertyValue: yup
      .number()
      .moreThan(MIN_PROPERTY_VALUE)
      .required(),
    monthlyIncome: yup.number().required(),
    age: yup
      .number()
      .required()
      .min(MIN_AGE)
      .max(MAX_AGE),
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
      .length(8)
      .required(),
    terms: yup
      .number()
      .oneOf(TERMS)
      .required(),
    email: yup
      .string()
      .strict()
      .email()
      .required(),
    loanMotivation: yup.array().of(yup.string().oneOf(LOAN_MOTIVATION)),
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
