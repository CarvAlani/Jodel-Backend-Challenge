const Movie = require('../models/movie');
const { getCached, addToCache } = require('../helpers/redis');

module.exports = {
  getResults: (filter, filterArray, filtersName, limit, offset, cached) => {
    if (cached) {
      // console.log('from cache');
      return getCached(filtersName);
    }
    // console.log('from db');
    return Movie.find(filter)
      .skip(offset)
      .limit(limit)
      .then(movies => addToCache(movies, filterArray, filtersName))
      .then(() => getCached(filtersName));
  }
};
