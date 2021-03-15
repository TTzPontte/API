module.exports = () => {
  return {
    before: async handler => {
      const { event } = handler;
      const { body } = event;

      const payload = JSON.parse(body);

      if (!payload) return;

      event.body = { ...payload };

      const {
        headers: { Authorization: auth = '' }
      } = event;
      const [clientId] = Buffer.from(auth.replace(/^\s*[Bb]asic\s+/, ''), 'base64')
        .toString()
        .split(':');

      event.clientId = clientId;
      return;
    }
  };
};
