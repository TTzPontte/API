const path = process.env.NODE_ENV === 'test' ? '../layers/common/' : '/opt/';
const { success, badRequest, failure } = require(`${path}lambda/response`);
const { save } = require(`${path}/services/auditlog`);

exports.handler = async event => {
  const { Records } = event;

  try {
    if (!Records) return badRequest('Bad request');
    if (!Records.length) return badRequest('You should send at least one record');

    const records = await save(Records);

    return success({ records });
  } catch (error) {
    return failure(error);
  }
};
