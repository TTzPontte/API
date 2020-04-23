const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const _ = require(`${path}/node_modules/lodash`);
const createError = require(`${path}/node_modules/http-errors`);
const { validateCpf, validateCnpj } = require(`${path}/helpers/validator`);

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

const isSecondPayer = ({ secondPayer, persona, whoIsSecondPayer }) => secondPayer && whoIsSecondPayer === persona;
const isSpouse = (persona, maritalStatus) => {
  const arr = [MARITAL_STATUS[0], MARITAL_STATUS[1], MARITAL_STATUS[2]];
  return arr.includes(maritalStatus) && persona === 'spouse';
};
const isPropertyOwner = ({ whoIsOwner, persona, isResident }) => isResident === 'THIRD_PARTIES' && whoIsOwner === persona;

yup.addMethod(yup.string, 'validCpf', () => yup.string().test('validate', cpf => validateCpf(cpf)));
yup.addMethod(yup.string, 'validCnpj', () => yup.string().test('validate', cnpj => validateCnpj(cnpj)));

const getPersonasSchema = ({ whoIsSecondPayer, property: { whoIsOwner }, people: { secondPayer } }) =>
  PERSONAS.reduce((obj, persona) => {
    const userSchema = yup
      .object({
        cpf: yup
          .string()
          .strict()
          .length(11)
          .required()
          .validCpf(),
        name: yup.string().required(),
        birth: yup.date().required(),
        email: yup
          .string()
          .email()
          .required(),
        averageIncome: yup.string().when('secondPayer', {
          is: () => isSecondPayer({ secondPayer, persona, whoIsSecondPayer }),
          then: yup.string().required()
        }),
        incomeSource: yup.string().when('secondPayer', {
          is: () => isSecondPayer({ secondPayer, persona, whoIsSecondPayer }),
          then: yup.string().required()
        })
      })
      .when(['maritalStatus', 'secondPayer', 'isResident'], {
        is: (maritalStatus, secondPayer, isResident) =>
          isSpouse(persona, maritalStatus) ||
          isSecondPayer({ secondPayer, persona, whoIsSecondPayer }) ||
          isPropertyOwner({ isResident, whoIsOwner, persona }),
        then: yup.object().required()
      })
      .default(null)
      .nullable();
    return { ...obj, [persona]: userSchema };
  }, {});

const validate = async fields => {
  const personaSchema = getPersonasSchema(fields);

  const peopleSchema = yup
    .object()
    .shape(
      {
        birth: yup.date().required(),
        averageIncome: yup.number().required(),
        incomeSource: yup
          .string()
          .strict()
          .oneOf(INCOME_SOURCES)
          .required(),
        cnpj: yup
          .string()
          .strict()
          .length(14)
          .when('cpf', {
            is: cpf => !cpf,
            then: yup
              .string()
              .strict()
              .required()
              .validCnpj()
          }),
        email: yup
          .string()
          .strict()
          .email()
          .required(),
        cpf: yup
          .string()
          .strict()
          .length(11)
          .when('cnpj', {
            is: cnpj => !cnpj,
            then: yup
              .string()
              .strict()
              .required()
              .validCpf()
          }),
        incomeSourceActivity: yup
          .string()
          .strict()
          .when('cnpj', {
            is: cnpj => cnpj,
            then: yup
              .string()
              .strict()
              .required()
          }),
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
      },
      ['cpf', 'cnpj']
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
    whoIsSecondPayer: yup
      .string()
      .strict()
      .oneOf(PERSONAS)
      .when('secondPayer', {
        is: secondPayer => secondPayer,
        then: yup
          .string()
          .strict()
          .required()
      }),
    clientId: yup
      .string()
      .strict()
      .required()
  });

  try {
    const { isResident, whoIsOwner } = _.get(fields, 'property', {});
    const { secondPayer } = _.get(fields, 'people', {});
    await peopleSchema.validate({ ...fields.people, isResident, whoIsOwner });
    await propertySchema.validate(fields.property);
    const isValid = await schema.validate({ ...fields, secondPayer });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate };
