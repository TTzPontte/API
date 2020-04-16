const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const _ = require(`${path}/node_modules/lodash`);
const createError = require(`${path}/node_modules/http-errors`);
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

const calc = (string, size) => {
  let sum = 0;

  for (let j = 0; j < size; ++j) {
    sum += Number(string.toString().charAt(j)) * (size + 1 - j);
  }

  const lastSumChecker = sum % 11;

  return lastSumChecker < 2 ? 0 : 11 - lastSumChecker;
};

const validateCpf = cpf => {
  const firstNineDigits = cpf.substring(0, 9);
  const checker = cpf.substring(9, 11);

  if (cpf.length !== 11) {
    return false;
  }

  for (let i = 0; i < 10; i++) {
    if (`${firstNineDigits}${checker}` === Array(12).join(String(i))) {
      return false;
    }
  }

  const checker1 = calc(firstNineDigits, 9);
  const checker2 = calc(`${firstNineDigits}${checker1}`, 10);

  return checker.toString() === checker1.toString() + checker2.toString();
};

yup.addMethod(yup.string, 'validCpf', () => yup.string().test('validate', cpf => validateCpf(cpf)));

const getPersonasSchema = ({ people, whoIsSecondPayer }) =>
  PERSONAS.reduce((obj, persona) => {
    if (people[persona] && !_.isEmpty(people[persona])) {
      const userSchema = yup
        .object()
        .shape({
          cpf: yup
            .string()
            .length(11)
            .validCpf()
            .required(),
          name: yup.string().required(),
          birth: yup.string().required(),
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
    .shape({
      birth: yup.string().required(),
      averageIncome: yup.number().required(),
      incomeSource: yup
        .string()
        .oneOf(INCOME_SOURCES)
        .required(),
      cnpj: yup
        .string()
        .length(14)
        .when('cpf', {
          is: cpf => !cpf,
          then: yup.string().required()
        }),
      email: yup
        .string()
        .email()
        .required(),
      cpf: yup
        .string()
        .length(11)
        .when('cnpj', {
          is: cnpj => !cnpj,
          then: yup.string().required()
        })
        .validCpf(),
      incomeSourceActivity: yup.string().when('cnpj', {
        is: cnpj => cnpj,
        then: yup.string().required()
      }),
      children: yup.boolean().required(),
      maritalStatus: yup.string().oneOf(MARITAL_STATUS),
      educationLevel: yup.string().oneOf(EDUCATION_LEVELS),
      secondPayer: yup.boolean().required(),
      liveInProperty: yup.boolean().required(),
      address: yup
        .object()
        .shape({
          cep: yup.string().required(),
          city: yup.string().required(),
          complement: yup.string().notRequired(),
          neighborhood: yup.string().required(),
          number: yup.string().required(),
          state: yup.string().required(),
          streetAddress: yup.string().required()
        })
        .required(),
      phone: yup.string().required(),
      ...personaSchema
    })
    .required();

  const propertySchema = yup
    .object()
    .shape({
      address: yup
        .object()
        .shape({
          cep: yup.string().required(),
          city: yup.string().required(),
          complement: yup.string().notRequired(),
          neighborhood: yup.string().required(),
          number: yup.string().required(),
          state: yup.string().required(),
          streetAddress: yup.string().required()
        })
        .required(),
      type: yup
        .string()
        .oneOf(PROPERTY_TYPES)
        .required(),
      floorArea: yup.string().required(),
      age: yup
        .string()
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
          is: resident => resident === 'Terceiros',
          then: yup.string().required()
        }),
      garages: yup
        .string()
        .oneOf(GARAGES)
        .when('type', {
          is: type => type === PROPERTY_TYPES[0],
          then: yup.string().required()
        }),
      financed: yup.boolean().required(),
      financingDebt: yup.string().when('financed', {
        is: financed => financed,
        then: yup.string().required()
      })
    })
    .required();

  const schema = yup.object().shape({
    people: peopleSchema,
    property: propertySchema,
    whoIsSecondPayer: yup.string().oneOf(PERSONAS),
    clientId: yup.string().required(),
    legalName: yup.string(),
    legalCNPJ: yup.string().length(14)
  });

  try {
    const isValid = await schema.validate(fields);
    return !!isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateCpf };
