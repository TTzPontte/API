const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const createError = require(`${path}/node_modules/http-errors`);
const { validateDocumentNumber } = require(`${path}/helpers/validator`);

let {
  MIN_PROPERTY_VALUE,
  MIN_AGE,
  MAX_AGE,
  TERMS,
  MIN_LOAN_VALUE,
  MAX_LOAN_VALUE,
  MARITAL_STATUS,
  PROPERTY_TYPES,
  PROPERTY_AGE,
  BEDROOMS,
  RESIDENTS,
  PERSONAS,
  GARAGES,
  suitesOptions,
  INCOME_SOURCES
} = require('./constants');

MARITAL_STATUS = Object.keys(MARITAL_STATUS);
PROPERTY_TYPES = Object.keys(PROPERTY_TYPES);
PERSONAS = Object.keys(PERSONAS);
INCOME_SOURCES = Object.keys(INCOME_SOURCES);
RESIDENTS = Object.keys(RESIDENTS);

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const getAddressSchema = async address => {
  const addressSchema = yup
    .object()
    .shape({
      type: yup
        .string()
        .strict()
        .required(),
      cep: yup
        .string()
        .strict()
        .required(),
      city: yup
        .string()
        .strict()
        .required(),
      neighborhood: yup
        .string()
        .strict()
        .required(),
      number: yup
        .string()
        .strict()
        .required(),
      state: yup
        .string()
        .strict()
        .required(),
      streetAddress: yup
        .string()
        .strict()
        .required(),
      complement: yup
        .string()
        .strict()
        .notRequired()
    })
    .required();

  return { addressSchema };
};

const getIncomeSchema = async income => {
  const incomeSchema = yup.array().of(
    yup
      .object()
      .shape({
        source: yup
          .string()
          .strict()
          .oneOf(INCOME_SOURCES)
          .required(),
        activity: yup
          .string()
          .strict()
          .required(),
        deliveryDate: yup
          .string()
          .strict()
          .required(),
        averageIncome: yup.string()
      })
      .required()
  );
  return { incomeSchema };
};

const validate = async fields => {
  const { address, income } = fields.consumer;
  const addressSchema = getAddressSchema(address);
  const incomeSchema = getIncomeSchema(income);

  const consumerSchema = yup.object({
    name: yup
      .string()
      .strict()
      .required(),
    cpf: yup
      .string()
      .strict()
      .required()
      .documentNumber(),
    email: yup
      .string()
      .strict()
      .email()
      .required(),
    birthdate: yup.date().required(),
    age: yup
      .number()
      .min(MIN_AGE)
      .max(MAX_AGE)
      .required(),
    motherName: yup
      .string()
      .strict()
      .required(),
    nationality: yup
      .string()
      .strict()
      .required(),
    birthState: yup.string().when('nationality', {
      is: 'BRAZILIAN',
      then: yup.string().required()
    }),
    birthCity: yup.string().when('nationality', {
      is: 'BRAZILIAN',
      then: yup.string().required()
    }),
    gender: yup
      .string()
      .strict()
      .required(),
    maritalStatus: yup
      .string()
      .strict()
      .oneOf(MARITAL_STATUS)
      .required(),
    spouseName: yup.string().when('maritalStatus', {
      is: 'REGISTERED_STABLE_UNION' || 'MARRIED',
      then: yup.string().required()
    }),
    identilyDocument: yup
      .string()
      .strict()
      .required(),
    documentIssueDate: yup.date().required(),
    documentIssuingBody: yup
      .string()
      .strict()
      .required(),
    terms: yup
      .number()
      .oneOf(TERMS)
      .required(),
    loanValue: yup
      .number()
      .moreThan(MIN_LOAN_VALUE)
      .max(MAX_LOAN_VALUE)
      .required(),
    ...addressSchema,
    ...incomeSchema
  });

  const propertySchema = yup
    .object()
    .shape({
      address: yup
        .object()
        .shape({
          cep: yup
            .string()
            .strict()
            .required(),
          city: yup
            .string()
            .strict()
            .required(),
          complement: yup
            .string()
            .strict()
            .notRequired(),
          neighborhood: yup
            .string()
            .strict()
            .required(),
          number: yup
            .string()
            .strict()
            .required(),
          state: yup
            .string()
            .strict()
            .required(),
          streetAddress: yup
            .string()
            .strict()
            .required()
        })
        .required(),
      type: yup
        .string()
        .oneOf(PROPERTY_TYPES)
        .required(),
      floorArea: yup
        .string()
        .strict()
        .required(),
      age: yup
        .string()
        .strict()
        .oneOf(PROPERTY_AGE)
        .required(),
      value: yup
        .number()
        .moreThan(MIN_PROPERTY_VALUE)
        .required(),
      bedrooms: yup
        .string()
        .oneOf(BEDROOMS)
        .required(),
      suites: yup
        .string()
        .oneOf(suitesOptions(fields.property.bedrooms))
        .required(),
      isResident: yup
        .string()
        .oneOf(RESIDENTS)
        .required(),
      owners: yup.array().of(
        yup.string(PERSONAS).when('isResident', {
          is: resident => resident === 'THIRD_PARTIES',
          then: yup
            .string()
            .strict()
            .required()
        })
      ),
      garages: yup
        .string()
        .oneOf(GARAGES)
        .when('type', {
          is: type => type === PROPERTY_TYPES[0],
          then: yup
            .string()
            .strict()
            .required()
        }),
      financed: yup.boolean().required(),
      financingDebt: yup
        .string()
        .strict()
        .when('financed', {
          is: financed => financed,
          then: yup
            .string()
            .strict()
            .required()
        })
    })
    .required();

  const schema = yup.object().shape({
    clientId: yup
      .string()
      .strict()
      .required()
  });

  try {
    const { clientId, loanValue, terms } = fields;
    await consumerSchema.validate({ ...fields.consumer, loanValue, terms });
    await propertySchema.validate(fields.property);
    const isValid = await schema.validate({ clientId });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate };
