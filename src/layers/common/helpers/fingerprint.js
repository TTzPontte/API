const Fingerprint2 = require('fingerprintjs2');

const trackCode = () => {
  return Fingerprint2.getPromise().then(components => {
    const values = components.map(({ value }) => value).join('');
    return Fingerprint2.x64hash128(values, 31);
  });
};

module.exports = { trackCode };
