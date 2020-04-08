const es = require('./aws_es_client');

const getClientSimulation = async ({ cpf, email, clientId }) => {
  const query = {
    index: 'pontte',
    type: 'simulations',
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                'parametros.cpf': cpf
              }
            },
            {
              term: {
                'parametros.email': email
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

module.exports = { getClientSimulation };
