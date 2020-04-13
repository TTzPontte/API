const path = process.env.NODE_ENV === 'test' ? '../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const _ = require(`${path}/node_modules/lodash`);
const createError = require(`${path}/node_modules/http-errors`);
const {
  MARITAL_STATUS,
  EDUCATION_LEVELS,
  PROPERTY_TYPES,
  PROPERTY_AGE,
  BEDROOMS,
  OWNERS,
  suitesOptions,
  PERSONAS_PT,
  PERSONAS,
  GARAGES
} = require('./constants');

const validate = async fields => {
  const isSecondPayer = (secondPayer, persona) => secondPayer === 'Sim' && fields.whoIsSecondPayer === persona;
  const isSpouse = persona => (MARITAL_STATUS[1] || MARITAL_STATUS[3] || MARITAL_STATUS[4]) && persona === 'spouse';

  const personaSchema = PERSONAS_PT.reduce((obj, persona, index) => {
    const people = fields.people[PERSONAS[index]];
    if (people && !_.isEmpty(people)) {
      const userSchema = yup
        .object()
        .shape({
          cpf: yup.string().required(),
          name: yup.string().required(),
          birth: yup.string().required(),
          email: yup
            .string()
            .email()
            .required(),
          averageIncome: yup.string().when('secondPayer', {
            is: secondPayer => isSecondPayer(secondPayer, persona),
            then: yup.string().required()
          }),
          incomeSource: yup.string().when('secondPayer', {
            is: secondPayer => isSecondPayer(secondPayer, persona),
            then: yup.string().required()
          })
        })
        .when('maritalStatus', {
          is: () => isSpouse(PERSONAS[index]),
          then: yup.object().required()
        });
      return { ...obj, [PERSONAS[index]]: userSchema };
    }
    return obj;
  }, {});

  const peopleSchema = yup
    .object()
    .shape({
      birth: yup.string().required(),
      averageIncome: yup.number().required(),
      incomeSource: yup.string().required(),
      cnpj: yup.string().length(14),
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
        }),
      incomeSourceActivity: yup.string().when('cnpj', {
        is: cnpj => cnpj,
        then: yup.string().required()
      }),
      children: yup
        .string()
        .oneOf(['Sim', 'Não'])
        .required(),
      maritalStatus: yup.string().oneOf(MARITAL_STATUS),
      educationLevel: yup.string().oneOf(EDUCATION_LEVELS),
      secondPayer: yup
        .string()
        .oneOf(['Sim', 'Não'])
        .required(),
      liveInProperty: yup
        .string()
        .oneOf(['Sim', 'Não'])
        .required(),
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
        .oneOf(['Próprio', 'Terceiros'])
        .required(),
      whoIsOwner: yup
        .string()
        .oneOf(OWNERS)
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
      financed: yup
        .string()
        .oneOf(['Sim', 'Não'])
        .required(),
      financingDebt: yup.string().when('financed', {
        is: financed => financed === 'Sim',
        then: yup.string().required()
      })
    })
    .required();

  const schema = yup.object().shape({
    people: peopleSchema,
    property: propertySchema,
    whoIsSecondPayer: yup.string().oneOf(PERSONAS_PT),
    clientId: yup.string().required(),
    legalName: yup.string(),
    legalCNPJ: yup.string().length(14)
  });

  const isValid = await schema.isValid(fields);
  if (!isValid) throw new createError.BadRequest('Campos inválidos');
  return isValid;
};

module.exports = { validate };
