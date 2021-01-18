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

module.exports = opts => {
  const defaults = {
    logger: error => process.env.NODE_ENV !== 'test' && console.log('WARNING: ', error),
    message: 'Internal server error',
    statusCode: 500
  };

  const options = Object.assign({}, defaults, opts);

  return {
    onError: (handler, next) => {
      console.log(typeof handler.error);
      console.log(handler.error);
      console.log(handler.error.toString());
      console.log(handler.error.name);
      console.log(handler.error.statusCode);
      console.log(handler.error.message);
      console.log(handler.error.details);
      options.logger(handler.error);
      let statusCode = options.statusCode;
      let message = options.message;

      if (handler.error.statusCode && handler.error.message) {
        statusCode = handler.error.statusCode;
        message = handler.error.message;
      }

      console.log(statusCode);
      console.log(message);

      console.log({
        headers,
        statusCode: statusCode,
        body: JSON.stringify({
          errors: [
            {
              status: statusCode,
              message: message,
              detail: handler.error.details || options.details
            }
          ]
        })
      });

      handler.response = {
        headers,
        statusCode: statusCode,
        body: JSON.stringify({
          errors: [
            {
              status: statusCode,
              message: message,
              detail: handler.error.details || options.details
            }
          ]
        })
      };

      return next();
    }
  };
};
