const _     = require('lodash');
const dayjs = require('dayjs');

function isDateKey(key) {
  return /^\d+\/\d+\/\d+$/.test(key);
}

function toNum(n) {
  return _.isString(n) ? Number(n.replace(/,/g, '')) : n;

}

function toTimeSeries(countries) {
  return _.mapValues(countries, (record) => {
    const values      = [];
    const timestamps  = [];

    _.keys(record)
      .sort((d1, d2) => dayjs(d1).isAfter(dayjs(d2)) ? 1 : -1)
      .forEach(date => {
        values.push(record[date]);
        timestamps.push(dayjs(date).format('YYYY-MM-DD') + 'T00:00:00+00:00');
      });

    return { values, timestamps };
  });
}

function toCountry(row) {
  const province = row['Province/State'];

  if (_.includes(['Hong Kong', 'Macau'], province)) {
    return province;
  }

  return row['Country/Region']
}

function normalize(data) {
  const countries = _.reduce(data, (res, row) => {
    const country     = toCountry(row);
    const countryData = res[country] || {};

    _.keys(row)
      .filter(isDateKey)
      .forEach(key => countryData[key] = (countryData[key] || 0) + toNum(row[key]));

    res[country] = countryData;

    return res;
  }, {});

  countries['World'] = _.values(countries).reduce((world, country) => {
    _.each(country, (val, key) => { world[key] = (world[key] || 0) + val; });
    return world;
  }, {});

  return toTimeSeries(countries);
}

module.exports = { normalize, isDateKey }