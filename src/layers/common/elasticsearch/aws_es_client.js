const { Client } = require('@elastic/elasticsearch');
const { AwsConnector } = require('./aws_es_connector');

const es = new Client({ node: process.env.ES_ENDPOINT, Connection: AwsConnector, log: 'trace' });

module.exports = es;
