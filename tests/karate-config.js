function fn() {
  // ESSE JAVASCRIPT não é lido pelo node mas por um JAVA
  // NÃO TEM SUPORTE A ES6
  var env = karate.env || 'dev';
  karate.log('karate.env system property was:', env);
  var config = {
    response: {},
    host: 'https://api' + env + '.pontte.com.br',
    hostECred: 'https://apiecred-' + env + '.pontte.com.br'
  };
  if (env == 'prod') {
    config.host = 'https://apid.pontte.com.br';
    config.hostECred = 'https://apiecred.pontte.com.br';
  }
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);
  return config;
}
