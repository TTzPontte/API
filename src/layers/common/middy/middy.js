const middy = require('middy');
const { httpSecurityHeaders } = require('middy/middlewares');

const httpErrorHandler = require('./httpErrorHandler');
const xray = require('./xray');

module.exports = handler => {
  return middy(handler)
    .use(xray())
    .use(httpSecurityHeaders())
    .use(httpErrorHandler());
};
