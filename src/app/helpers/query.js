function singleOrNone(row) {
  if (!row) {
    return null;
  }
  if (row == []) {
    return null;
  }
  return row[0];
}

module.exports = {
  singleOrNone
}
