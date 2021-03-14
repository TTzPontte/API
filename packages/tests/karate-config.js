function fn() {
  // ESSE JAVASCRIPT não é lido pelo node mas por um JAVA
  // NÃO TEM SUPORTE A ES6
  var allEnvVars = java.lang.System.getenv();
  var env = allEnvVars['TEST_ENV'] || 'dev';
  karate.log('TEST_ENV:', env);
  var eCredClient = allEnvVars['ECRED_API_CLIENT'] || '';
  var eCredKey = allEnvVars['ECRED_API_SECRET_KEY'] || '';
  if (!eCredClient || !eCredKey) {
    throw 'Informe as variáveis de ambiente ECRED_API_CLIENT e ECRED_API_SECRET_KEY';
  }
  var eCredClientKey = eCredClient + ':' + eCredKey;
  var eCredClientKeyBytes = eCredClientKey.getBytes();

  var config = {
    response: {},
    host: 'https://api' + env + '.pontte.com.br',
    hostAuth: java.lang.System.getenv('HOST_AUTH'),
    hostECred: 'https://apiecred-' + env + '.pontte.com.br',
    hostECredAuth: 'Basic ' + java.util.Base64.getEncoder().encodeToString(eCredClientKeyBytes)
  };
  if (env == 'prod') {
    config.host = 'https://apid.pontte.com.br';
    config.hostECred = 'https://apiecred.pontte.com.br';
  }
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);
  return config;
}
