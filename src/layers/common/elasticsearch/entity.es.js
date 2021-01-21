const es = require('./aws_es_client');

const INDEX = 'entity';
const TYPE = '_doc';

const getEntity = async ({ email, documentNumber }) => {
  const query = {
    index: INDEX,
    type: TYPE,
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                email
              }
            },
            {
              term: {
                documentNumber
              }
            }
          ]
        }
      }
    }
  };
  const { body } = await es.search(query);

  const data = [];
  for (const hits of body.hits.hits) {
    const source = hits._source;
    data.push({ ...source });
  }

  return data;
};

const getEntityByDocNumber = async ({ documentNumber }) => {
  const query = {
    index: INDEX,
    type: TYPE,
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                documentNumber
              }
            }
          ]
        }
      }
    }
  };
  const { body } = await es.search(query);

  const data = [];
  for (const hits of body.hits.hits) {
    const source = hits._source;
    data.push({ ...source });
  }

  return data;
};

module.exports = { getEntity, getEntityByDocNumber };
