const httpStatus = require('http-status');
const Movie = require('../models/movie');
const APIError = require('../helpers/APIError');

const MovieController = {
  readAll(req, res, next) {
    const filter = req.query.filter || {};
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : 0;
    // TODO: Add redis cache
    Movie.find(filter)
      .skip(offset)
      .limit(limit)
      .then(movies => res.json({
        movies,
        offset,
        limit,
        count: movies.length
        // nextPage and previousPage maybe
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
