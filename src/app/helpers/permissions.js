function isOnlyClient(roles) {
  return roles.length === 1 && roles[0] === 'cliente';
}

function hasType(roles, target) {
  return roles.includes(target);
}

module.exports = {
  isOnlyClient,
  hasType,
};
