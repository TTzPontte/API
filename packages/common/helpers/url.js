const getSiteUrl = () => {
  const { ENV } = process.env;

  const url = {
    prod: 'http://pontte.com.br',
    staging: 'http://playground.pontte.com.br',
    dev: 'http://localhost:8080'
  };

  return url[ENV];
};

module.exports = { getSiteUrl };
