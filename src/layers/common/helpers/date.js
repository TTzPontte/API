const getTimestamp = () => {
  const date = new Date();
  return date.getTime();
};

const getDateIsoString = () => {
  return new Date().toISOString();
};

const getNowDefaultDate = () => {
  const currentDate = new Date();

  let month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  month = month > 9 ? month : '0' + month;
  const year = currentDate.getFullYear();

  return year + '-' + month + '-' + date;
};

module.exports = {
  getDateIsoString,
  getTimestamp,
  getNowDefaultDate
};
