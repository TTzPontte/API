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

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const getRelationsSchema = () => {
  const relationsSchema = yup
    .object()
    .shape({
    participation: yup
          .string()
          .strict()
          .required(),
        id: yup
          .string()
          .strict()
          .required(),
        type: yup
          .array()
          .of(
            yup
            .string()
          )
      });

  return { relationsSchema };
};

const getAddressSchema = () => {
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
    .required()

    return { addressSchema };
};

const getIncomeSchema = ({ fields: { secondPayers } }) =>
  PERSONAS.reduce((obj, persona) => {
    const incomeSchema = yup
      .array()
      .of(
        yup
        .object()
        .shape({
          type: yup
            .string()
            .strict()
            .required(),
          source: yup.string().when('secondPayers', {
            is: () => isSecondPayers({ secondPayers, persona }),
            then: yup.string().required()
          }),
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
          averageIncome: yup.string().when('secondPayers', {
            is: () => isSecondPayers({ secondPayers, persona }),
            then: yup.string().required()
          }),
        }),
      )
      .required()
    return { ...obj, [persona]: incomeSchema };
  }, {});

const getFilesSchema = () => {
  const filesSchema = yup
    .array()
    .of(
      yup
      .object()
      .shape({
        category: yup
          .string()
          .strict()
          .required(),
        type: yup
          .string()
          .strict()
          .required(),
        filename: yup
          .string()
          .strict()
          .required(),
        id: yup
          .string()
          .strict()
          .required(),
        size: yup
          .string()
          .strict()
          .required(),
        date: yup
          .date()
          .required(),
      })
    );

    return { filesSchema };
};

const getIdWallCompaniesSchema = () => {
  const idWallCompaniesSchema = yup
    .array()
    .of(
      yup
      .object()
      .shape({
        cnpj: yup
          .string()
          .strict()
          .required()
          .documentNumber(),
        name: yup
          .string()
          .strict()
          .required(),
        relationship: yup
          .string()
          .strict()
          .required(),
      })
    );

  return { idWallCompaniesSchema };
};

const getDocumentsSchema = () => {
  const documentsSchema = yup
    .array()
    .of(
      yup
      .object()
      .shape({
        type: yup
          .string()
          .strict()
          .required(),
        value: yup
          .string()
          .strict()
          .required(),
      })
    );

  return { documentsSchema };
};

const getAboutSchema = () => {
  const aboutSchema = yup
    .object()
    .shape({
      hasSiblings: yup
        .boolean()
        .required(),
      hasChild: yup
        .boolean()
        .required(),
      birthdate: yup
        .date()
        .required(),
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
        .required(),
    })
    .required();

    return { aboutSchema };
};

const validate = async fields => {
  const {
    relations,
    address,
    income,
    files,
    idWallCompanies,
    documents,
    about
  } = fields.entity;

  const relationsSchema = getRelationsSchema(relations);
  const addressSchema = getAddressSchema(address);
  const incomeSchema = getIncomeSchema({ income, fields });
  const filesSchema = getFilesSchema(files);
  const idWallCompaniesSchema = getIdWallCompaniesSchema(idWallCompanies);
  const documentsSchema = getDocumentsSchema(documents);
  const aboutSchema = getAboutSchema(about);

  const entitySchema = yup
    .object({
      documentNumber: yup
        .string()
        .strict()
        .required()
        .documentNumber(),
      email: yup
        .string()
        .email()
        .required(),
      contactEmail: yup
        .string()
        .strict(),
      type: yup
        .string()
        .strict(),
      accounts: yup
        .array(),
      phone: yup
        .string()
        .strict()
        .matches(PHONE_REG_EXP, 'Phone number is invalid')
        .required(),
      liveInProperty: yup
        .boolean()
        .required(),
      name: yup
        .string()
        .strict()
        .required(),
      nickname: yup
        .string()
        .strict()
        .required(),
      registry: yup
        .array(),
      ...relationsSchema,
      ...addressSchema,
      ...incomeSchema,
      ...filesSchema,
      ...idWallCompaniesSchema,
      ...documentsSchema,
      ...aboutSchema,
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
      owners: yup
        .array()
        .of(
          yup
          .string(PERSONAS)
          .when('isResident', {
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
      secondPayers: yup
        .array()
        .of(
          yup
          .string(PERSONAS)
          .required(),
        ),
      clientId: yup
        .string()
        .strict()
        .required()
    });

    try {
      console.log('entrei no try');
      const { isResident, owners } = _.get(fields, 'property', {});
      const secondPayers = _.get(fields, 'secondPayers', [])[0];
      await entitySchema.validate({ ...fields.entity, isResident, owners });
      await propertySchema.validate(fields.property);
      const isValid = await schema.validate({ ...fields, secondPayers });
      console.log('isValid -> ', isValid);
      return isValid;
    } catch (err) {
      throw new createError.BadRequest(err.message);
    }
};

module.exports = { validate, validateDocumentNumber};
