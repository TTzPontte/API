module.exports = {
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    set: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString(),
    set: () => new Date().toISOString()
  }
};
