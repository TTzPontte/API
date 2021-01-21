const es = require('./aws_es_client');

const getClientContract = async ({ documentNumber, email, clientId }) => {
  const query = {
    index: 'contract',
    type: 'report',
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                'simulation.parameters.cpf': documentNumber
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

const getClientContractByDocNumber = async ({ documentNumber, email, clientId }) => {
  const query = {
    index: 'contract',
    type: 'report',
    body: {
      query: {
        bool: {
          should: [
            {
              term: {
                'simulation.parameters.cpf': documentNumber
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

module.exports = { getClientContract, getClientContractByDocNumber };
