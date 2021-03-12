module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hugao du bist der Beste!!!',
      input: event
    })
  };
};
