const { v3: uuid3 } = require('uuid');
const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

const remove_non_alphanum = value => value.toString().replace(/[^0-9a-zA-Z]+/g);

const urlEncode = data =>
  Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

exports.idOf = value => {
  const uid = uuid3(remove_non_alphanum(value), NAMESPACE_OID, []);
  return urlEncode(uid);
};
