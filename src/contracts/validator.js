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
  RESIDENTS
} = require('./constants');

MARITAL_STATUS = Object.keys(MARITAL_STATUS);
EDUCATION_LEVELS = Object.keys(EDUCATION_LEVELS);
PROPERTY_TYPES = Object.keys(PROPERTY_TYPES);
PERSONAS = Object.keys(PERSONAS);
INCOME_SOURCES = Object.keys(INCOME_SOURCES);
RESIDENTS = Object.keys(RESIDENTS);

const isSecondPayer = ({ secondPayer, persona, whoIsSecondPayer }) => secondPayer === 'Sim' && whoIsSecondPayer === persona;
const isSpouse = persona => (MARITAL_STATUS[1] || MARITAL_STATUS[3] || MARITAL_STATUS[4]) && persona === 'spouse';

yup.addMethod(yup.string, 'validCpf', () => yup.string().test('validate', cpf => validateCpf(cpf)));
yup.addMethod(yup.string, 'validCnpj', () => yup.string().test('validate', cnpj => validateCnpj(cnpj)));

const getPersonasSchema = ({ people, whoIsSecondPayer }) =>
  PERSONAS.reduce((obj, persona) => {
    if (people[persona] && !_.isEmpty(people[persona])) {
      const userSchema = yup
        .object()
        .shape({
          cpf: yup
            .string()
            .strict(true)
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
            is: secondPayer => isSecondPayer({ secondPayer, persona, whoIsSecondPayer }),
            then: yup.string().required()
          }),
          incomeSource: yup.string().when('secondPayer', {
            is: secondPayer => isSecondPayer({ secondPayer, persona, whoIsSecondPayer }),
            then: yup.string().required()
          })
        })
        .when('maritalStatus', {
          is: () => isSpouse(persona),
          then: yup.object().required()
        });
      return { ...obj, [persona]: userSchema };
    }
    return obj;
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
          .strict(true)
          .oneOf(INCOME_SOURCES)
          .required(),
        cnpj: yup
          .string()
          .strict(true)
          .length(14)
          .when('cpf', {
            is: cpf => !cpf,
            then: yup
              .string()
              .strict(true)
              .required()
              .validCnpj()
          }),
        email: yup
          .string()
          .strict(true)
          .email()
          .required(),
        cpf: yup
          .string()
          .strict(true)
          .length(11)
          .when('cnpj', {
            is: cnpj => !cnpj,
            then: yup
              .string()
              .strict(true)
              .required()
              .validCpf()
          }),
        incomeSourceActivity: yup
          .string()
          .strict(true)
          .when('cnpj', {
            is: cnpj => cnpj,
            then: yup
              .string()
              .strict(true)
              .required()
          }),
        children: yup.boolean().required(),
        maritalStatus: yup
          .string()
          .strict(true)
          .oneOf(MARITAL_STATUS),
        educationLevel: yup
          .string()
          .strict(true)
          .oneOf(EDUCATION_LEVELS),
        secondPayer: yup.boolean().required(),
        liveInProperty: yup.boolean().required(),
        address: yup
          .object()
          .shape({
            cep: yup
              .string()
              .strict(true)
              .required(),
            city: yup
              .string()
              .strict(true)
              .required(),
            complement: yup
              .string()
              .strict(true)
              .notRequired(),
            neighborhood: yup
              .string()
              .strict(true)
              .required(),
            number: yup
              .string()
              .strict(true)
              .required(),
            state: yup
              .string()
              .strict(true)
              .required(),
            streetAddress: yup
              .string()
              .strict(true)
              .required()
          })
          .required(),
        phone: yup
          .string()
          .strict(true)
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
            .strict(true)
            .required(),
          city: yup
            .string()
            .strict(true)
            .required(),
          complement: yup
            .string()
            .strict(true)
            .notRequired(),
          neighborhood: yup
            .string()
            .strict(true)
            .required(),
          number: yup
            .string()
            .strict(true)
            .required(),
          state: yup
            .string()
            .strict(true)
            .required(),
          streetAddress: yup
            .string()
            .strict(true)
            .required()
        })
        .required(),
      type: yup
        .string()
        .strict(true)
        .oneOf(PROPERTY_TYPES)
        .required(),
      floorArea: yup
        .string()
        .strict(true)
        .required(),
      age: yup
        .string()
        .strict(true)
        .oneOf(PROPERTY_AGE)
        .required(),
      bedrooms: yup
        .string()
        .strict(true)
        .oneOf(BEDROOMS)
        .required(),
      suites: yup
        .string()
        .strict(true)
        .oneOf(suitesOptions(fields.property.bedrooms))
        .required(),
      isResident: yup
        .string()
        .strict(true)
        .oneOf(RESIDENTS)
        .required(),
      whoIsOwner: yup
        .string()
        .strict(true)
        .oneOf(PERSONAS)
        .when('isResident', {
          is: resident => resident === 'Terceiros',
          then: yup
            .string()
            .strict(true)
            .required()
        }),
      garages: yup
        .string()
        .strict(true)
        .oneOf(GARAGES)
        .when('type', {
          is: type => type === PROPERTY_TYPES[0],
          then: yup
            .string()
            .strict(true)
            .required()
        }),
      financed: yup.boolean().required(),
      financingDebt: yup
        .string()
        .strict(true)
        .when('financed', {
          is: financed => financed,
          then: yup
            .string()
            .strict(true)
            .required()
        })
    })
    .required();

  const schema = yup.object().shape({
    people: peopleSchema,
    property: propertySchema,
    whoIsSecondPayer: yup
      .string()
      .strict(true)
      .oneOf(PERSONAS),
    clientId: yup
      .string()
      .strict(true)
      .required(),
    legalName: yup.string().strict(true),
    legalCNPJ: yup
      .string()
      .strict(true)
      .length(14)
  });

  try {
    const isValid = await schema.validate(fields);
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateCpf };
