const User = require('../models/user');

const save = async ({ id, trackingCode, peopleId, campaign, source }) => {
  const user = new User({
    id,
    trackingCodes: [trackingCode],
    peopleId,
    campaign,
    source
  });

  return user.save();
};

module.exports = { save };
