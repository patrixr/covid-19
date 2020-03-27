import _ from "lodash";

export function cache(func) {
  let data = {};

  return function(...args) {
    const cacheKey = JSON.stringify(args);

    if (data[cacheKey]) return data[cacheKey];

    const result = func.apply(this, args);
    data[cacheKey] = result;

    return result;
  };
}