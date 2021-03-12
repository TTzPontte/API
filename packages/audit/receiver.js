const Lambda = require('common/lambda');
const AuditLogService = require('common/services/auditlog.js');

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
