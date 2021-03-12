const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const sendMessage = async (body, accountId, nameSQS) => {
  const queueUrl = `https://sqs.us-east-1.amazonaws.com/${accountId}/${nameSQS}`;

  const params = {
    MessageBody: body,
    QueueUrl: queueUrl,
    DelaySeconds: 0
  };

  return sqs.sendMessage(params).promise();
};

module.exports = { sendMessage };
