const path = process.env.NODE_ENV === 'test' ? '../../layers/common/' : '/opt/';
const Lambda = require(`${path}lambda`);
const AuditLogService = require(`${path}services/auditlog.js`);

exports.handler = async event => {
  const { Records } = event;

  try {
    if (!Records) return Lambda.Response.badRequest('Bad request');
    if (!Records.length) return Lambda.Response.badRequest('You should send at least one record');

    const records = await AuditLogService.save(Records);

    return Lambda.Response.success({ records });
  } catch (error) {
    return Lambda.Response.failure(error);
  }
};
