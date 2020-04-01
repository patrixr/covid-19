import _          from 'lodash'
import { cache }  from '../utils/cache'
import dailyData  from '../../data/daily.json'
import {
  confirmed_cases,
  deaths,
  recoveries
} from '../../data/series.json'

const ALL = 'World';

export const { timestamps }  = confirmed_cases[ALL];

export const recordDate = _.last(timestamps);

const ZEROES = timestamps.map(() => 0);

export const countries = () => {
  return _.keys(confirmed_cases);
}

export const confirmedCasesOf = (country = ALL) => {
  return _.get(confirmed_cases, `${country}.values`, ZEROES);
}

export const deathsOf = (country = ALL) => {
  return _.get(deaths, `${country}.values`, ZEROES);
}

export const recoveriesOf = (country = ALL) => {
  return _.get(recoveries, `${country}.values`, ZEROES);
}

export const activeCasesOf = cache((country = ALL) => {
  return confirmedCasesOf(country).map((val, idx) => {
    return val - recoveriesOf(country)[idx] - deathsOf(country)[idx];
  });
});

export const latestChanges = cache(() => {
  const latestDaily = dailyData[dailyData.length - 1].data;
  const secondLastestDaily = dailyData[dailyData.length - 2].data;

  return _.mapValues(latestDaily, (countryData, country) => {
    return _.mapValues(countryData, (val, key) => {
      return val - _.get(secondLastestDaily, `${country}.${key}`,  0);
    });
  });
});

export const timelineData = (country = ALL)  => {
  const series = [{
    name: 'Active Cases',
    data: activeCasesOf(country),
  }, {
    name: 'Recoveries',
    data: recoveriesOf(country)
  }, {
    name: 'Deaths',
    data: deathsOf(country)
  }];

  return { series, timestamps };
}

export const latestStats = () => {
  return _.reduce(countries(), (table, country) => {
    table.push({
      country: country,
      confirmed: _.last(confirmedCasesOf(country)),
      recoveries: _.last(recoveriesOf(country)),
      deaths: _.last(deathsOf(country)),
      newCases: _.get(latestChanges(), `${country}.Confirmed`, 0),
      newDeaths: _.get(latestChanges(), `${country}.Deaths`, 0),
    });
    return table;
  }, []);
};

export const worldStats = () => {
  return _.find(latestStats(), ['country', 'World']);
}
