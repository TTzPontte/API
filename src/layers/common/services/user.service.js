const User = require('../models/user');

const save = async ({ id, cpf, trackingCode, entityId, campaign, source }) => {
  const user = new User({
    id,
    cpf,
    trackingCodes: [trackingCode],
    entityId,
    campaign,
    source
  });

  return user.save();
};

module.exports = { save };
