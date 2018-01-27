const httpStatus = require('http-status');
const Movie = require('../models/movie');
const APIError = require('../helpers/APIError');

const MovieController = {
  readAll(req, res, next) {
    const filter = req.query.filter || {};
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;
    // TODO: Add redis cache
    Movie.find(filter)
      .skip(offset)
      .limit(limit)
      .then(movies => res.json({
        movies,
        page,
        count: movies.length,
        limit,
        // totalPages ?
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
