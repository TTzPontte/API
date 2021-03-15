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

const build = statusCode => body => {
  return {
    headers,
    statusCode,
    body: body !== undefined ? JSON.stringify(body) : ''
  };
};

const buildError = statusCode => message => {
  return {
    headers,
    statusCode,
    body: JSON.stringify({
      statusCode,
      message
    })
  };
};

const created = build(201);

const success = build(200);

const noContent = build(204);

const badRequest = buildError(400);

const unauthorized = buildError(401);

const forbidden = buildError(403);

const notFound = buildError(404);

const notAcceptable = buildError(406);

const conflict = buildError(409);

const failure = buildError(500);

module.exports = {
  created,
  success,
  noContent,
  notAcceptable,
  conflict,
  failure,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  build
};
