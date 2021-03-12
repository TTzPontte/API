const getTimestamp = () => {
  const date = new Date();
  return date.getTime();
};

const getDateIsoString = () => {
  return new Date().toISOString();
};

const getNowDefaultDate = () => {
  return getDateIsoString().slice(0, 10);
};

module.exports = {
  getDateIsoString,
  getTimestamp,
  getNowDefaultDate
};
