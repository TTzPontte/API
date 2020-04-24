const Process = require('../models/process');

const save = async ({
  contractId,
  whoIsSecondPayer,
  haveRegistration,
  incomeSource,
  isResident,
  liveInProperty,
  maritalStatus,
  secondPayer,
  suites
}) => {
  const process = new Process({
    contractId,
    screen: {
      data: {
        currentStep: 2,
        whoIsSecondPayer,
        incomeSource,
        isResident,
        liveInProperty,
        maritalStatus,
        secondPayer,
        suites
      }
    }
  });
  return process.save();
};

module.exports = { save };
