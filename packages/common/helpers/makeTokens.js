const basicToken = (user, passwd) => {
  return Buffer.from(`${user}:${passwd}`).toString('base64');
};

module.exports = { basicToken };
