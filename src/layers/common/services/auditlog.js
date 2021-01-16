const path = process.env.ENV === 'test' ? '../' : '/opt/';
const AuditLogModel = require(`${path}models/auditLog`);

const save = async records => {
  return Promise.all(
    records.map(async data => {
      const log = new AuditLogModel(JSON.parse(data.body));
      return log.save();
    })
  );
};

module.exports = { save };
