const middy = require('middy');
const { httpSecurityHeaders } = require('middy/middlewares');

const httpErrorHandler = require('./httpErrorHandler');
const xray = require('./xray');
const auth = require('./auth');
const parserBody = require('./parserBody');

module.exports = handler => {
  return middy(handler)
    .use(xray())
    .use(httpSecurityHeaders())
    .use(httpErrorHandler())
    .use(auth())
    .use(parserBody());
};
