require('dotenv').config()

const express           = require('express');
const debug             = require('debug')('server');
const cache             = require('../data/cache')(process.env.REDIS_URL, process.env.REDIS_PORT);
const { cleanEndpoint } = require('../utils/helpers');

const app = express();
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(async (req, res, next) => {
  await cache.ready;
  next();
});

app.get('*', async (req, res) => {
  try {
    const key = cleanEndpoint(`covid/${req.path}`);
    console.log(key);
    res.json(await cache.get(key));
  } catch (e) {
    res.status(400).json({ error: e.toString() });
  }
});

app.listen(port, () => {
  debug(`Server running on port ${port}`);
});