const User = require('../models/user');

const save = async ({ id, cpf, trackingCode, peopleId, campaign, source }) => {
  const user = new User({
    id,
    cpf,
    trackingCodes: [trackingCode],
    peopleId,
    campaign,
    source
  });

  return user.save();
};

module.exports = { save };
