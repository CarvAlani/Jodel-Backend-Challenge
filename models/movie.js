const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line prefer-destructuring

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
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', MovieSchema);
