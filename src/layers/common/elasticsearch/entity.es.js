const es = require('./aws_es_client');

const INDEX = 'entity';
const TYPE = '_doc';

class EntityEs {
  static async upsert(id, body) {
    let query = {
      index: INDEX,
      type: TYPE,
      id,
      body
    };

    return await es.index(query);
  }

  static async remove(id) {
    let query = {
      index: INDEX,
      type: TYPE,
      id
    };

    return await es.delete(query);
  }

  static async filter(search) {
    const query = {
      index: INDEX,
      type: TYPE,
      body: {
        size: 10000,
        query: {
          multi_match: {
            query: search,
            fields: ['name', 'email', 'documentNumber'],
            minimum_should_match: '100%'
          }
        }
      }
    };

    const { body } = await es.search(query);
    const { hits } = body.hits;
    const data = hits.reduce((arr, { _source: user }) => [...arr, user], []);

    return data;
  }
}

module.exports = EntityEs;
