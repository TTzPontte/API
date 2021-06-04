const { v3: uuid3 } = require('uuid');
const NAMESPACE_OID = '6ba7b812-9dad-11d1-80b4-00c04fd430c8';

const remove_non_alphanum = value => value.toString().replace(/[^0-9a-zA-Z]+/g);

exports.idOf = value => {
  const uid = uuid3(NAMESPACE_OID, remove_non_alphanum(value), []);
  return Buffer.from(uid)
    .toString('base64')
    .replace(/=+/g, '');
};
