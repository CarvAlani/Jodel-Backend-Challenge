const httpStatus = require('http-status');
const Movie = require('../models/movie');
const APIError = require('../helpers/APIError');
const { client, isCached } = require('../helpers/redis');
const { getResults } = require('../helpers/mongo');
const utils = require('../helpers/utils');
const Promise = require('bluebird');

const MovieController = {
  /**
  * @swagger
  * /movies:
  *   get:
  *     tags:
  *       - Movies
  *     description: Returns all movies
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: limit
  *         description: Return limit
  *         in: query
  *         required: false
  *         type: integer
  *       - name: page
  *         description: Return page
  *         in: query
  *         required: false
  *         type: integer
  *       - name: filter[title]
  *         description: Filter by title
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[description]
  *         description: Filter by description
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[genre]
  *         description: Filter by genre
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[director]
  *         description: Filter by director
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: An array of movies
  *         schema:
  *           properties:
  *             docs:
  *               type: array
  *               items:
  *                 allOf:
  *                   - $ref: '#/definitions/Movies'
  *                   - properties:
  *                       id:
  *                         type: string
  *                       _id:
  *                         type: string
  *                       title:
  *                         type: string
  *                       description:
  *                         type: string
  *                       genre:
  *                         type: string
  *                       director:
  *                         type: string
  *                       year:
  *                         type: string
  *                       createdAt:
  *                         type: string
  *             count:
  *               type: integer
  *             limit:
  *               type: integer
  *             page:
  *               type: integer
  */
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
  /**
  * @swagger
  * /movies:
  *   post:
  *     tags:
  *       - Movies
  *     description: Creates a movie
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: movie
  *         description: Movie object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/Movies'
  *              - properties:
  *                  title:
  *                    type: string
  *                  description:
  *                    type: string
  *                  genre:
  *                    type: string
  *                  director:
  *                    type: string
  *                  year:
  *                    type: string
  *                required:
  *                  - title
  *     responses:
  *       200:
  *         description: Successfully created
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/Movies'
  *              - properties:
  *                  _id:
  *                    type: string
  *                  title:
  *                    type: string
  *                  description:
  *                    type: string
  *                  genre:
  *                    type: string
  *                  director:
  *                    type: string
  *                  year:
  *                    type: string
  *                  createdAt:
  *                    type: string
  */
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
