function isArray(obj) {
  return Array.isArray(obj);
}

function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = {
  isArray,
  isEmptyObj,
};
