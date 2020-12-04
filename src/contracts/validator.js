const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const _ = require(`${path}/node_modules/lodash`);
const createError = require(`${path}/node_modules/http-errors`);
const { validateDocumentNumber } = require(`${path}/helpers/validator`);

let {
  MARITAL_STATUS,
  EDUCATION_LEVELS,
  PROPERTY_TYPES,
  PROPERTY_AGE,
  BEDROOMS,
  suitesOptions,
  PERSONAS,
  GARAGES,
  INCOME_SOURCES,
  RESIDENTS,
  PHONE_REG_EXP
} = require('./constants');

MARITAL_STATUS = Object.keys(MARITAL_STATUS);
EDUCATION_LEVELS = Object.keys(EDUCATION_LEVELS);
PROPERTY_TYPES = Object.keys(PROPERTY_TYPES);
PERSONAS = Object.keys(PERSONAS);
INCOME_SOURCES = Object.keys(INCOME_SOURCES);
RESIDENTS = Object.keys(RESIDENTS);

const isSecondPayers = ({ secondPayers, persona }) => secondPayers === persona;
const isSpouse = (persona, maritalStatus) => {
  const arr = [MARITAL_STATUS[0], MARITAL_STATUS[1], MARITAL_STATUS[2]];
  return arr.includes(maritalStatus) && persona === 'spouse';
};
const isPropertyOwner = ({ whoIsOwner, persona, isResident }) => isResident === 'THIRD_PARTIES' && whoIsOwner === persona;

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const getPersonasSchema = ({ property: { whoIsOwner }, entity: { secondPayers } }) =>
  PERSONAS.reduce((obj, persona) => {
    const userSchema = yup
      .object({
        documentNumber: yup
          .string()
          .strict()
          .length(11)
          .required()
          .documentNumber(),
        name: yup.string().required(),
        birth: yup.date().required(),
        email: yup
          .string()
          .email()
          .required(),
        averageIncome: yup.string().when('secondPayers', {
          is: () => isSecondPayers({ secondPayers, persona }),
          then: yup.string().required()
        }),
        incomeSource: yup.string().when('secondPayers', {
          is: () => isSecondPayers({ secondPayers, persona }),
          then: yup.string().required()
        })
      })
      .when(['maritalStatus', 'secondPayers', 'isResident'], {
        is: (maritalStatus, secondPayers, isResident) =>
          isSpouse(persona, maritalStatus) ||
          isSecondPayers({ secondPayers, persona }) ||
          isPropertyOwner({ isResident, whoIsOwner, persona }),
        then: yup.object().required()
      })
      .default(null)
      .nullable();
    return { ...obj, [persona]: userSchema };
  }, {});

const validate = async fields => {
  const personaSchema = getPersonasSchema(fields);
  const entitySchema = yup
    .object()
    .shape(
      {
        name: yup.string().required(),
        nickname: yup.string(),
        birth: yup.date().required(),
        averageIncome: yup.number().required(),
        incomeSource: yup
          .string()
          .strict()
          .oneOf(INCOME_SOURCES)
          .required(),
        documentNumber: yup
          .string()
          .strict()
          .length(11)
          .required()
          .documentNumber(),
        email: yup
          .string()
          .strict()
          .email()
          .required(),
        children: yup.boolean().required(),
        maritalStatus: yup
          .string()
          .strict()
          .oneOf(MARITAL_STATUS)
          .required(),
        educationLevel: yup
          .string()
          .strict()
          .oneOf(EDUCATION_LEVELS)
          .required(),
        secondPayer: yup.boolean().required(),
        liveInProperty: yup.boolean().required(),
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
        phone: yup
          .string()
          .strict()
          .matches(PHONE_REG_EXP, 'Phone number is invalid')
          .required(),
        ...personaSchema
      }
    )
    .required();

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
      whoIsOwner: yup
        .string()
        .oneOf(PERSONAS)
        .when('isResident', {
          is: resident => resident === 'THIRD_PARTIES',
          then: yup
            .string()
            .strict()
            .required()
        }),
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
    secondPayers: yup
      .string()
      .strict()
      .oneOf(PERSONAS)
      .required(),
    clientId: yup
      .string()
      .strict()
      .required()
  });

  try {
    const { isResident, whoIsOwner } = _.get(fields, 'property', {});
    const secondPayers = _.get(fields, 'secondPayers', [])[0];
    await entitySchema.validate({ ...fields.entity, isResident, whoIsOwner });
    await propertySchema.validate(fields.property);
    const isValid = await schema.validate({ ...fields, secondPayers });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateDocumentNumber };
