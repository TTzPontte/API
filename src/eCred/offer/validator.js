const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const _ = require(`${path}/node_modules/lodash`);
const createError = require(`${path}/node_modules/http-errors`);
const { validateDocumentNumber } = require(`${path}/helpers/validator`);

let { PROPERTY_TYPES, PROPERTY_AGE, BEDROOMS, suitesOptions, PERSONAS, GARAGES, RESIDENTS, PHONE_REG_EXP, LOAN_MOTIVATION } = require('./constants');

PROPERTY_TYPES = Object.keys(PROPERTY_TYPES);
PERSONAS = Object.keys(PERSONAS);
RESIDENTS = Object.keys(RESIDENTS);

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const getRelationsSchema = async relations => {
  const relationsSchema = yup.object().shape({
    participation: yup.string().strict(),
    id: yup.string().strict(),
    type: yup.array().of(yup.string())
  });

  return { relationsSchema };
};

const getAddressSchema = async address => {
  const addressSchema = yup
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
    .required();

  return { addressSchema };
};

const getIncomeSchema = income => {
  const incomeSchema = yup.array().of(
    yup
      .object()
      .shape({
        type: yup
          .string()
          .strict()
          .required(),
        activity: yup
          .string()
          .strict()
          .required(),
        value: yup
          .string()
          .strict()
          .required(),
        incomeOrigin: yup
          .string()
          .strict()
          .required(),
        averageIncome: yup.string().required()
      })
      .required()
  );
  return { incomeSchema };
};

const getAboutSchema = async about => {
  const aboutSchema = yup
    .object()
    .shape({
      hasSiblings: yup.boolean().required(),
      hasChild: yup.boolean().required(),
      birthdate: yup.date().required(),
      educationLevel: yup
        .string()
        .strict()
        .required(),
      maritalStatus: yup
        .string()
        .strict()
        .required(),
      maritalRegime: yup
        .string()
        .strict()
        .required()
    })
    .required();

  return { aboutSchema };
};

const validate = async fields => {
  const { relations, address, income, about } = fields.entity;

  const { secondPayers } = fields.secondPayers;

  const relationsSchema = getRelationsSchema(relations);
  const addressSchema = getAddressSchema(address);
  const incomeSchema = getIncomeSchema({ income, secondPayers });
  const aboutSchema = getAboutSchema(about);

  const entitySchema = yup.object({
    documentNumber: yup
      .string()
      .strict()
      .required()
      .documentNumber(),
    email: yup
      .string()
      .email()
      .required(),
    contactEmail: yup.string().strict(),
    type: yup.string().strict(),
    accounts: yup.array(),
    phone: yup
      .string()
      .strict()
      .matches(PHONE_REG_EXP, 'Phone number is invalid')
      .required(),
    liveInProperty: yup.boolean().required(),
    name: yup
      .string()
      .strict()
      .required(),
    nickname: yup
      .string()
      .strict()
      .required(),
    registry: yup.array(),
    ...relationsSchema,
    ...addressSchema,
    ...incomeSchema,
    ...aboutSchema
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
    secondPayers: yup.array().of(
      yup
        .string(PERSONAS)
        .strict()
        .required()
    ),
    loanMotivation: yup.array().of(
      yup
        .string(LOAN_MOTIVATION)
        .strict()
        .required()
    ),
    loanValue: yup.number().required(),
    terms: yup.number().required(),
    clientId: yup
      .string()
      .strict()
      .required()
  });

  try {
    const { isResident, owners } = _.get(fields, 'property', {});
    const { clientId } = fields;
    const secondPayers = _.get(fields, 'secondPayers', []);
    await entitySchema.validate({ ...fields.entity, isResident, owners });
    await propertySchema.validate(fields.property);
    const isValid = await schema.validate({ clientId, secondPayers });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateDocumentNumber };
