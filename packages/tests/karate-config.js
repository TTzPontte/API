function fn() {
  // ESSE JAVASCRIPT não é lido pelo node mas por um JAVA
  // NÃO TEM SUPORTE A ES6
  var allEnvVars = java.lang.System.getenv();
  var env = allEnvVars['TEST_ENV'] || 'dev';
  karate.log('TEST_ENV:', env);
  var eCredClient = allEnvVars['ECRED_API_CLIENT'] || '';
  var eCredKey = allEnvVars['ECRED_API_SECRET_KEY'] || '';
  var apiClientId = allEnvVars['API_CLIENT'] || '';
  var apiClientSecretKey = allEnvVars['API_SECRET_KEY'] || '';
  if (!eCredClient || !eCredKey) {
    throw 'Informe as variáveis de ambiente ECRED_API_CLIENT e ECRED_API_SECRET_KEY';
  }
  var eCredClientKey = eCredClient + ':' + eCredKey;
  function getBytes(str) {
    if (typeof str !== 'string') return str;
    return str.getBytes(java.nio.charset.StandardCharsets.UTF_8);
  }
  function base64(data) {
    return java.util.Base64.getUrlEncoder()
      .withoutPadding()
      .encodeToString(getBytes(data));
  }
  function jwtAuth(body) {
    function sign(toSign) {
      var mac = javax.crypto.Mac.getInstance('HmacSHA256');
      var secretKeySpec = new javax.crypto.spec.SecretKeySpec(getBytes(apiClientSecretKey), 'HmacSHA256');
      mac.init(secretKeySpec);
      var signedBytes = mac.doFinal(getBytes(toSign));
      return base64(signedBytes);
    }
    var b64Header = base64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    var b64Body = base64(JSON.stringify(body || {}));
    var b64HeaderBody = b64Header + '.' + b64Body;
    return b64HeaderBody + '.' + sign(b64HeaderBody);
  }
  function authHeader() {
    return 'Bearer ' + jwtAuth({ clientId: apiClientId });
  }
  function signedBody(content) {
    return { payload: jwtAuth(content) };
  }
  function signedFile(path) {
    return signedBody(JSON.parse(karate.readAsString(path)));
  }

  var config = {
    response: {},
    host: 'https://api' + env + '.pontte.com.br/v1/',
    hostAuth: java.lang.System.getenv('HOST_AUTH'),
    hostECred: 'https://apiecred-' + env + '.pontte.com.br',
    hostECredAuth: 'Basic ' + base64(eCredClientKey),
    authHeader: authHeader(),
    signedBody: signedBody,
    signedFile: signedFile
  };
  if (env == 'prod') {
    config.host = 'https://apid.pontte.com.br/v1/';
    config.hostECred = 'https://apiecred.pontte.com.br';
  }
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);
  return config;
}
