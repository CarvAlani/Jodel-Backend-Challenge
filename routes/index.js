const express = require('express');
const validate = require('express-validation');
const movieRoutes = require('./movie');

const router = express.Router(); // eslint-disable-line new-cap

validate.options({
  allowUnknownBody: false,
});

router.use('/movies', movieRoutes);

module.exports = router;
