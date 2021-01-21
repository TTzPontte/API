const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const yup = require(`${path}/node_modules/yup`);
const createError = require(`${path}/node_modules/http-errors`);
const { validateDocumentNumber } = require(`${path}/helpers/validator`);

let {
  LOAN_MOTIVATION,
  PHONE_REG_EXP,
  PERSONAS,
  PROPERTY_TYPES,
  PROPERTY_AGE,
  BEDROOMS,
  suitesOptions,
  RESIDENTS,
  GARAGES,
  EDUCATION_LEVELS,
  MARITAL_STATUS
} = require('./constants');

yup.addMethod(yup.string, 'documentNumber', () => yup.string().test('validate', documentNumber => validateDocumentNumber(documentNumber)));

const validate = async fields => {
  const consumerSchema = yup.object({
    cpf: yup
      .string()
      .strict()
      .required()
      .documentNumber(),
    email: yup
      .string()
      .email()
      .required(),
    name: yup
      .string()
      .strict()
      .required(),
    birth_date: yup.date().required(),
    mother_name: yup
      .string()
      .strict()
      .required(),
    marital_status: yup
      .string(MARITAL_STATUS)
      .strict()
      .required(),
    age: yup.number().required(),
    education_level: yup
      .string(EDUCATION_LEVELS)
      .strict()
      .required()
  });

  const orderSchema = yup.object().shape({
    order: yup
      .object()
      .shape({
        proposal_id: yup
          .string()
          .strict()
          .required()
      })
      .required()
  });

  const questionsSchema = yup.object().shape({
    value: yup.number().required(),
    installments: yup
      .string()
      .strict()
      .required(),
    cellphone: yup
      .string()
      .strict()
      .matches(PHONE_REG_EXP, 'Phone number is invalid')
      .required(),
    ocupation: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .required()
      })
      .required(),
    profession: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .required()
      })
      .required(),
    income: yup.number().required(),
    address_zip_code: yup
      .string()
      .strict()
      .required(),
    address: yup
      .string()
      .strict()
      .required(),
    address_number: yup
      .string()
      .strict()
      .required(),
    address_neighborhood: yup
      .string()
      .strict()
      .required(),
    address_city: yup
      .string()
      .strict()
      .required(),
    address_state: yup
      .object()
      .shape({
        label: yup
          .string()
          .strict()
          .required(),
        value: yup
          .string()
          .strict()
          .required()
      })
      .required(),
    loanMotivation: yup.array().of(yup.string(LOAN_MOTIVATION).strict()),
    secondPayers: yup
      .array()
      .of(
        yup
          .string(PERSONAS)
          .strict()
          .required()
      )
      .required()
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
        .string(PROPERTY_TYPES)
        .strict()
        .required(),
      floorArea: yup
        .string()
        .strict()
        .required(),
      property_value: yup.number().required(),
      age: yup
        .string(PROPERTY_AGE)
        .strict()
        .required(),
      bedrooms: yup.string(BEDROOMS).required(),
      suites: yup
        .string(suitesOptions(fields.questions.property.bedrooms))
        .strict()
        .required(),
      isResident: yup
        .string(RESIDENTS)
        .strict()
        .required(),
      garages: yup.string(GARAGES).when('type', {
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
    const { clientId, consumer, questions, order } = fields;
    await consumerSchema.validate(consumer);
    await orderSchema.validate({ order });
    await questionsSchema.validate(questions);
    await propertySchema.validate(questions.property);
    const isValid = await schema.validate({ clientId });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateDocumentNumber };
