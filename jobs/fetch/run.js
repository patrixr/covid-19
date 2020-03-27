// @ts-nocheck

const path  = require('path');
const fs    = require('fs');
const chalk = require('chalk');
const _     = require('lodash');
const git   = require('simple-git/promise')();
const csv   = require('csvtojson');
const { execSync } = require("child_process");
const {
  normalize
} = require('./normalize');

const write = (v) => process.stdout.write(v);

const REPO = 'git@github.com:CSSEGISandData/COVID-19.git'

console.log(chalk.blueBright(':Pulling data'));

/**
 * Process helper
 *
 * @returns Function[]
 */
const step = async (text, promise) => {
  if (text) {
    write(chalk.magentaBright(`::${text}`));
    write('\n');
  }

  return promise;
}

const FILES = {
  'confirmed_cases': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  'deaths': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  'recoveries': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
};

(async function () {

  const dataFolder   = path.join(__dirname, '../../data');
  const repoFolder  = path.join(dataFolder, `tmp-repo`);

  await step('Cloning', git.clone(REPO, repoFolder));

  step('Processing');
  const data = {};
  for (let key in FILES) {
    data[key] = normalize(await csv().fromFile(path.join(repoFolder, FILES[key])));
  }

  const asString = /prod/.test(process.env.NODE_ENV) ? JSON.stringify(data) : JSON.stringify(data, null, 2);

  step('Saving', fs.writeFileSync(path.join(dataFolder, 'series.json'), asString));

  execSync(`rm -rf ${repoFolder}`);

})();