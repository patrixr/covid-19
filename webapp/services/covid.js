import _          from 'lodash';
import { cache }  from '../utils/cache';
import {
  confirmed_cases,
  deaths,
  recoveries
} from '../../data/series.json';

const ALL = 'World';

export const { timestamps }  = confirmed_cases[ALL];

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
