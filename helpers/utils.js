module.exports = {
  objectToArray: (obj) => {
    const keys = Object.keys(obj);
    const values = [];
    for (let i = 0; i < keys.length; i++) { // eslint-disable-line no-plusplus
      values.push(keys[i]);
      values.push(obj[keys[i]]);
    }
    return values;
  },
  compareByCreatedAt: (a, b) => {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  },
  objectToKeyValueString: (obj = {}) => Object.keys(obj).map(key => `${key}:${obj[key]}`),
};
