const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../param_validations/movie');
const movieCtrl = require('../controllers/movie');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .get(movieCtrl.readAll)
  .post(validate(paramValidation.create), movieCtrl.create);

module.exports = router;
