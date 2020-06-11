const es = require('./aws_es_client');

const getClientContract = async ({ cpf, email, clientId }) => {
  const query = {
    index: 'contract',
    type: 'report',
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                'simulation.parameters.cpf': cpf
              }
            },
            {
              term: {
                'simulation.parameters.email': email
              }
            }
          ],
          must_not: {
            match: {
              clientApiId: clientId
            }
          }
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

module.exports = { getClientContract };
