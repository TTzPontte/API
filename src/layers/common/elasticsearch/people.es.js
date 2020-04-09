const es = require('./aws_es_client');

const getPeople = async ({ cpf, email }) => {
  const query = {
    index: 'people',
    type: '_doc',
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                cpf
              }
            },
            {
              term: {
                email
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

module.exports = { getPeople };
