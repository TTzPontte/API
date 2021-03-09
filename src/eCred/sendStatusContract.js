const path = process.env.NODE_ENV === 'test' ? '../../layers/common' : '/opt';
const { postEcredStatusContractUpdated } = require(`${path}/helpers/requests`);

class StatusContract {
  static async send(data) {
    return postEcredStatusContractUpdated(data);
  }
}

module.exports = StatusContract;
