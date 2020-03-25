const { promisify } = require("util");
const redis         = require("redis");
const { defer }     = require('../utils/async');
const debug         = require('debug')('cache');

module.exports = (url, port = '6379') => {

  const deferred = defer();

  const client = redis.createClient(url);

  client.once("error", (error) => {
    debug(error);
    deferred.reject(error);
  });

  client.once("connect", () => {
    debug("Redis connected");
    deferred.resolve(true);
  });

  const redisGet = promisify(client.get).bind(client);
  const redisSet = promisify(client.set).bind(client)

  return {
    ready:  deferred.promise,

    async get(key) {
      const val = await redisGet(key);
      if (!val) { return null; }

      return JSON.parse(val)['value'];
    },

    async set(key, value) {
      const data = JSON.stringify({ value });
      await redisSet(key, data);

      debug(`${key} saved`);
    },
  }
};