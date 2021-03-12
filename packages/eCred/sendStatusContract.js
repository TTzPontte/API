const { postEcredStatusContractUpdated } = require('common/helpers/requests');

class StatusContract {
  static async send(data) {
    return postEcredStatusContractUpdated(data);
  }
}

module.exports = StatusContract;
