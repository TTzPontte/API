const AuditLogModel = require('../models/auditLog');

const save = async records => {
  return Promise.all(
    records.map(async data => {
      const log = new AuditLogModel(JSON.parse(data.body));
      return log.save();
    })
  );
};

module.exports = { save };
