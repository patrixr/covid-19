const _     = require('lodash');

function numericString(n) {
  return /^[0-9,\.]+$/.test(n);
}

function parseNumber(str) {
  return Number(str.replace(/,/g, ''));
}

function normalize(record) {
  if (_.isArray(record)) {
    return _.map(record, normalize);
  }

  return _.chain(record)
    .keys()
    .reduce((res, key) => {
      const val = record[key];
      res[key] = (numericString(val) ? parseNumber(val) : val) || 0
      return res;
    }, {})
    .value();
}

function cleanEndpoint(endpoint) {
  return endpoint.replace(/\/{2,}/g, '/')
}

module.exports = { normalize, parseNumber, numericString, cleanEndpoint }