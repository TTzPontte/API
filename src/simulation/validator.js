const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const { MIN_PROPERTY_VALUE, MIN_AGE, MAX_AGE, TERMS, MIN_LOAN_VALUE, LOAN_MOTIVATION, GRACE_PERIOD } = require('./constants');

const validate = async fields => {
  const schema = yup.object().shape({
    loanValue: yup
      .number()
      .moreThan(MIN_LOAN_VALUE)
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
    cpf: yup
      .string()
      .length(11)
      .required(),
    phone: yup
      .string()
      .length(19) // +55 (99) 99999-9999
      .required(),
    cep: yup
      .string()
      .length(8)
      .required(),
    terms: yup
      .number()
      .oneOf(TERMS)
      .required(),
    email: yup
      .string()
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

  const isValid = await schema.isValid(fields);

  return isValid;
};

module.exports = { validate };
