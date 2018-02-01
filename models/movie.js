const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line prefer-destructuring

/**
  * @swagger
  * definitions:
  *   Movies:
  *     type: object
  *     required:
  *       - title
  *     properties:
  *       title:
  *         type: string
  *       description:
  *         type: string
  *       genre:
  *         type: string
  *       director:
  *         type: string
  *       year:
  *         type: string
  */
const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  genre: {
    type: String
  },
  director: {
    type: String
  },
  year: {
    type: String
  },
  createdAt: {
    type: String,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', MovieSchema);
