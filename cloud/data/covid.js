const axios         = require('axios');
const _             = require('lodash');
const { cached }    = require('tronicache');
const { normalize } = require('../utils/helpers');
const debug         = require('debug')('covid');

const API_KEY    = process.env.COVID_API_KEY;
const BASE_URL   = 'https://coronavirus-monitor.p.rapidapi.com/coronavirus'

if (!API_KEY) {
  throw 'Missing env variable: COVID_API_KEY';
}

const HISTORY_FIELDS = [
  'total_cases',
  'new_cases',
  'active_cases',
  'total_deaths',
  'new_deaths',
  'total_recovered',
  'serious_critical',
  'total_cases_per1m',
  'record_date'
];

const STAT_FIELDS = [
  'cases',
  'deaths',
  'total_recovered',
  'new_deaths',
  'new_cases',
  'serious_critical',
  'active_cases',
  'total_cases_per_1m_population'
];

module.exports = cached({
  cache: true,
  timeout: 60 * 60 * 1000,

  /**
   * Fetches an array of countries
   *
   * @returns {Promise<String[]>} the country list
   */
  async countries() {
    const stats = await this.statsPerCountry();
    return _.map(stats, 'country_name').filter(_.identity);
  },

  /**
   * Fetches the current stat of every country
   * Includes total as a 'world' key
   *
   * @returns {Promise<Object>} stats per country.
   */
  async statsPerCountry() {
    const { countries_stat } = await this.uncached.get('/cases_by_country.php');
    const stats = normalize(countries_stat);

    const world_stats = _.reduce(stats, (world, stat) => {
      _.each(STAT_FIELDS, f => world[f] = (world[f] || 0) + stat[f]);
      return world
    }, {});

    return _.extend({ world: world_stats }, _.mapValues(_.keyBy(stats, 'country_name'), _.identity));
  },

  /**
   * Fetches the history of every country
   * Includes total as a 'world' key
   *
   * @returns {Promise<Object>} history per country
   */
  async historyPerCountry() {
    const countries = await this.countries();

    const world  = [];
    const data    = { world };

    await Promise.all(_.map(countries, c => this.historyOfCountry(c))); // Preload in parallel

    for (let country of countries) {
      const countryHistory = await this.historyOfCountry(country);

      _.each(countryHistory, (record, idx) => {
        if (!world[idx]) {
          world[idx] = _.pick(record, HISTORY_FIELDS)
        } else {
          _.reject(HISTORY_FIELDS, (f) => f == 'record_date').forEach(f => world[idx][f] += record[f]);
        }
      });

      data[country] = countryHistory;
    }

    return data;
  },

  /**
   * Fetches the history of a country
   *
   * @param {String} country the country name
   * @returns {Promise<Object[]>} history of the specified country
   */
  async historyOfCountry(country) {
    const { stat_by_country } = await this.uncached.get('/cases_by_particular_country.php', { country });
    return normalize(stat_by_country);
  },

  uncached: {
    cache: false,

    async get(endpoint, params = {}) {
      const headers = {
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      };

      debug(`Reading ${endpoint}`, params);

      const { data } = await axios.get(BASE_URL + endpoint, { params, headers });
      return data
    }
  }
});
