const Joi = require('joi');

module.exports = {
  create: {
    body: {
      title: Joi.string().required(),
      description: Joi.string(),
      genre: Joi.string(),
      director: Joi.string(),
      year: Joi.number().integer(),
    },
  },
  readAll: {
    query: {
      filter: Joi.object(),
      limit: Joi.number().integer(),
      page: Joi.number().integer()
    },
  },
};
