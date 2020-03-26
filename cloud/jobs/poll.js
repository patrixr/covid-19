require('dotenv').config();

const covid = require('../data/covid');
const cache = require('../data/cache')(process.env.REDIS_URL, process.env.REDIS_PORT);
const debug = require('debug')('poll');

async function save(key, value) {
  const fullKey = `covid/${key}`;
  await cache.set(fullKey, value);
}

async function poll(type) {
  debug('Polling')

  const countries         = await covid.countries();
  const statsPerCountry   = await covid.statsPerCountry();
  const historyPerCountry = await covid.historyPerCountry();

  await save('countries', countries);
  await save('stats', statsPerCountry);
  await save('history', historyPerCountry);

  for (let country of countries) {
    const history = await historyPerCountry[country];
    const stats   = await statsPerCountry[country];

    await save(`history/${country.toLowerCase()}`, history);
    await save(`stats/${country.toLowerCase()}`, stats);
  }

  await save('time', Date.now());
}

cache.ready
  .then(poll)
  .then(() => {
    debug('Poll completed without errors');
    process.exit(0)
  })
  .catch(e => {
    debug(e);
    process.exit(1);
  })
