const redis = require('promise-redis')();
const config = require('../config');
const utils = require('../helpers/utils');
const Promise = require('bluebird');

const client = redis.createClient(config.redis.host);

const addObjectToSets = (movie) => {
  const movieCopy = Object.assign({}, movie);
  const id = movieCopy._id.toString();
  movieCopy._id = undefined;
  client.sadd('movies', id);
  const keyValues = utils.objectToKeyValueString(movieCopy);
  return Promise.map(keyValues, (keyValue) => {
    client.sadd(keyValue, id);
  });
};

const cache = (movie) => {
  const movieCopy = Object.assign({}, movie);
  movieCopy._id = movieCopy._id.toString();
  return client.HMSET(movieCopy._id, movieCopy)
    .then(() => addObjectToSets(movieCopy))
    .then(() => Promise.resolve(movieCopy));
};

const getMembers = filtersName => client.smembers(filtersName);

module.exports = {
  client,
  addObjectToSets,
  cache,
  getCached: filtersName => getMembers(filtersName)
    .then(movies => Promise.mapSeries(movies, movie => client.hgetall(movie))),
  addToCache: (movies, filter, filtersName) =>
    Promise.mapSeries(movies, movie => cache(movie.toObject()))
      .then(() => client.sinterstore(filtersName, filter)),
  isCached: filtersName =>
    getMembers(filtersName)
      .then(members => members.length > 0),
  query: (filter = [], filtersName = '', limit = 10, offset = 0, sortBy = 'createdAt', desc = false) => {
    const order = desc ? 'DESC' : 'ASC';
    return client.sinterstore(filtersName, filter)
      .then(() => client.SORT(filtersName, 'ALPHA', 'BY', `*->${sortBy}`, order, 'LIMIT', offset, limit))
      .then(movies => Promise.mapSeries(movies, movie => client.hgetall(movie)));
  }
};

