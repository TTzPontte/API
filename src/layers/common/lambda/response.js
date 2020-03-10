const headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
};

/**
 * Build a correct response to API Gatway
 *
 * @param {Number} statusCode Status of request
 * @param {Object} body Data will pass in request
 */

const build = statusCode => body => {
  return {
    headers,
    statusCode,
    body: body !== undefined ? JSON.stringify(body) : ''
  };
};

/**
 * Build a correct response error to API Gatway
 *
 * @param {Number} statusCode Status of request
 * @param {Object|String} msg Data will pass in request
 */
const buildError = statusCode => msg => {
  return {
    headers,
    statusCode,
    body: JSON.stringify({
      statusCode,
      msg
    })
  };
};

/**
 * Build a response whit Status Code 201
 *
 * @param {Object|String} msg Data will pass in request
 */
const created = build(201);

/**
 * Build a response whit Status Code 200
 *
 * @param {Object|String} msg Data will pass in request
 */
const success = build(200);

/**
 * Build a response whit Status Code 204
 *
 * @param {Object|String} msg Data will pass in request
 */
const noContent = build(204);

/**
 * Build a response whit Status Code 400
 *
 * @param {Object|String} msg Data will pass in request
 */
const badRequest = buildError(400);

/**
 * Build a response whit Status Code 401
 *
 * @param {Object|String} msg Data will pass in request
 */
const unauthorized = buildError(401);

/**
 * Build a response whit Status Code 403
 *
 * @param {Object|String} msg Data will pass in request
 */
const forbidden = buildError(403);

/**
 * Build a response whit Status Code 404
 *
 * @param {Object|String} msg Data will pass in request
 */
const notFound = buildError(404);

/**
 * Build a response whit Status Code 406
 *
 * @param {Object|String} msg Data will pass in request
 */
const notAcceptable = buildError(406);

/**
 * Build a response whit Status Code 500
 *
 * @param {Object|String} msg Data will pass in request
 */
const failure = buildError(500);

module.exports = {
  created,
  success,
  noContent,
  notAcceptable,
  failure,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  build
};
