// @ts-nocheck

const path  = require('path');
const fs    = require('fs');
const chalk = require('chalk');
const _     = require('lodash');
const git   = require('simple-git/promise')();
const csv   = require('csvtojson');
const { execSync } = require("child_process");
const {
  perCountry,
  toTimeSeries
} = require('./normalize');

const write = (v) => process.stdout.write(v);

const REPO          = 'https://github.com/CSSEGISandData/COVID-19.git'
const DATA_FOLDER   = path.join(__dirname, '../../data');
const REPO_FOLDER   = path.join(DATA_FOLDER, `tmp-repo`);

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

async function loadSeries() {

  const TIME_SERIES = {
    'confirmed_cases': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
    'deaths': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
    'recoveries': 'csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
  };


  step('Processing');
  const data = {};
  for (let key in TIME_SERIES) {
    data[key] = toTimeSeries(await csv().fromFile(path.join(REPO_FOLDER, TIME_SERIES[key])));
  }

  const asString = /prod/.test(process.env.NODE_ENV) ? JSON.stringify(data) : JSON.stringify(data, null, 2);

  step('Saving time series', fs.writeFileSync(path.join(DATA_FOLDER, 'series.json'), asString));
}

async function loadDailyData() {
  const dailyFolder = path.join(REPO_FOLDER, 'csse_covid_19_data/csse_covid_19_daily_reports');

  const files     = fs.readdirSync(dailyFolder);
  const dailyData = [];
  for (let file of files) {
    if (!/^\d+-\d+-\d+.csv$/.test(file)) {
      continue;
    }

    const date = file.replace(/\.csv/, '');
    const data = perCountry(await csv().fromFile(path.join(dailyFolder, file)));

    dailyData.push({ date, data });
  }

  const asString = /prod/.test(process.env.NODE_ENV) ? JSON.stringify(dailyData) : JSON.stringify(dailyData, null, 2);

  step('Saving daily data', fs.writeFileSync(path.join(DATA_FOLDER, 'daily.json'), asString));
}

(async function () {
  await step('Cloning', git.clone(REPO, REPO_FOLDER));

  await loadSeries();
  await loadDailyData();

  step('Deleting repo', execSync(`rm -rf ${REPO_FOLDER}`));
})();
