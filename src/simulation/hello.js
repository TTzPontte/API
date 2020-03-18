const path = process.env.NODE_ENV === 'test' ? '../layers/common/' : '/opt/';
const Lambda = require(`${path}lambda`);

exports.handler = async event => Lambda.Response.success('Hello world');
