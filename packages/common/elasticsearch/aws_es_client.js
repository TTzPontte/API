const { Client } = require('@elastic/elasticsearch');
const once = require('lodash/once');
const { AwsConnector } = require('./aws_es_connector');

const es = once(() => new Client({ node: process.env.ES_ENDPOINT, Connection: AwsConnector, log: 'trace' }));

module.exports = es;
