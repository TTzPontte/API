const monthToYear = (rate = 0) => {
  return (1 + rate) ** 12 - 1;
};

const yearToMonth = (rate = 0) => {
  return (1 + rate) ** (1 / 12) - 1;
};

module.exports = {
  monthToYear,
  yearToMonth
};
