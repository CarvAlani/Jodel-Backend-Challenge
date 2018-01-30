const httpStatus = require('http-status');
const Movie = require('../models/movie');
const APIError = require('../helpers/APIError');
const { client, isCached } = require('../helpers/redis');
const { getResults } = require('../helpers/mongo');
const utils = require('../helpers/utils');
const Promise = require('bluebird');

const MovieController = {
  readAll(req, res, next) {
    const filter = req.query.filter || {};
    const filterArray = utils.objectToKeyValueString(req.query.filter);
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;
    filterArray.push('movies');
    let filtersName = filterArray.join(':');
    filtersName = `${filtersName}:limit:${limit}:offset:${offset}`;
    return isCached(filtersName, filterArray)
      .then(cached => getResults(filter, filterArray, filtersName, limit, offset, cached))
      .then(movies => res.json({
        movies,
        page,
        count: movies.length,
        limit,
      }))
      .catch(next);
  },
  create(req, res, next) {
    Movie.findOne({
      title: req.body.title,
    })
      .then((movie) => {
        if (!movie) {
          return Movie.create(req.body)
            .then(newMovie => res.json(newMovie))
            .then(() => client.flushdb) // remove only specific smembers from new object
            .catch(next);
        }
        return Promise.reject(new APIError(
          'That movie already exist.',
          httpStatus.CONFLICT
        ));
      })
      .catch(next);
  },
};

module.exports = MovieController;
