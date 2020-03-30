const _     = require('lodash');
const dayjs = require('dayjs');

function isDataKey(key) {
  return /^\d+\/\d+\/\d+$/.test(key) || _.includes([
    'Confirmed',
    'Deaths',
    'Recovered',
    'Active'
  ], key);
}

function toNum(n) {
  return _.isString(n) ? Number(n.replace(/,/g, '')) : n;

}

function normalizeSeries(countries) {
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
  const province = row['Province/State'] || row['Province_State'];

  if (_.includes(['Hong Kong', 'Macau'], province)) {
    return province;
  }

  const country = row['Country/Region'] || row['Country_Region'];

  if (/China/.test(country)) {
    return 'China';
  }

  return country;
}

function perCountry(data) {
  const countries = _.reduce(data, (res, row) => {
    const country     = toCountry(row);
    const countryData = res[country] || {};

    _.keys(row)
      .filter(isDataKey)
      .forEach(key => countryData[key] = (countryData[key] || 0) + toNum(row[key]));

    res[country] = countryData;

    return res;
  }, {});

  countries['World'] = _.values(countries).reduce((world, country) => {
    _.each(country, (val, key) => { world[key] = (world[key] || 0) + val; });
    return world;
  }, {});

  return countries;
}

function toTimeSeries(data) {
  return normalizeSeries(perCountry(data));
}

module.exports = { toTimeSeries, perCountry }