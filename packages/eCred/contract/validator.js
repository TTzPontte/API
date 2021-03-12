const yup = require('yup');
const createError = require('http-errors');
const { validateDocumentNumber } = require('common/helpers/validator');
let { PHONE_REG_EXP, INCOME_SOURCES } = require('./constants');

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
    age: yup.number().required()
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
          .oneOf(INCOME_SOURCES)
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
      .required()
  });

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
    const isValid = await schema.validate({ clientId });
    return isValid;
  } catch (err) {
    throw new createError.BadRequest(err.message);
  }
};

module.exports = { validate, validateDocumentNumber };
