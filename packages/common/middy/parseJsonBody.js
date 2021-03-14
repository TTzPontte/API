module.exports = () => {
  return {
    before: async handler => {
      const { event } = handler;
      const { body } = event;
      const { payload } = JSON.parse(body);

      if (!payload) return;

      event.body = { ...payload };
      return;
    }
  };
};
