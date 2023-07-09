function isOnlyClient(roles) {
  return roles.length === 1 && roles[0] === 'cliente';
}

module.exports = {
  isOnlyClient,
};
