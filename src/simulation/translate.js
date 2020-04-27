const { LOAN_MOTIVATION } = require('./constants');

const translate = ({ loanMotivation, ...data }) => {
  const motivation = loanMotivation.map(motivationItem => {
    return LOAN_MOTIVATION[motivationItem];
  });

  return {
    ...data,
    loanMotivation: motivation
  };
};

module.exports = translate;
