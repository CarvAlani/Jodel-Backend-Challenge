const expressWinston = require('express-winston');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('swagger-jsdoc');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const express = require('express');
const winston = require('winston');
const cors = require('cors');

const middlewares = require('./helpers/middlewares');
const config = require('./config');
const routes = require('./routes');
const { client } = require('./helpers/redis');

const app = express();

const winstonInstance = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    })
  ]
});

const spec = swaggerDoc({
  swaggerDefinition: {
    info: {
      title: 'Movies api',
      version: '0.0.1',
    },
    basePath: config.basePath,
  },
  apis: [
    'routes/**/*.js',
    'models/**/*.js',
    'controllers/**/*.js',
  ],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }));
}

swaggerTools.initializeMiddleware(spec, (middleware) => {
  app.use(config.basePath, routes);
  app.use(middleware.swaggerUi({
    apiDocs: `${config.basePath}docs.json`,
    swaggerUi: `${config.basePath}docs`,
    apiDocsPrefix: config.proxyPath,
    swaggerUiPrefix: config.proxyPath,
  }));
  app.use(middlewares.convertToApiError);
  app.use(middlewares.notFound);
  // log error in winston transports except when executing test suite
  if (config.env !== 'test') {
    app.use(expressWinston.errorLogger({
      winstonInstance
    }));
  }

  app.use(middlewares.addTrace);

  const querystring = `${config.mongo.host}${config.mongo.name}`;

  mongoose.models = {};
  mongoose.modelSchemas = {};

  mongoose.Promise = Promise;

  mongoose.connect(querystring)
    .then(({ connections }) => console.log(`Connected to Mongo server in ${connections[0].name}`)) // eslint-disable-line no-console
    .catch((err) => {
      console.error(err); // eslint-disable-line no-console
      return Promise.reject(new Error(`Unable to connect to database: ${querystring}`));
    });

  client.on('connect', () => {
    console.log('Connected to redis server'); // eslint-disable-line no-console
  });

  client.config('set', 'maxmemory', config.redis.maxMemory)
    .then(() => client.config('set', 'maxmemory-policy', 'allkeys-lru'))
    .then(() => client.config('get', 'maxmemory'))
    .then(console.log) // eslint-disable-line no-console
    .catch(err => console.error(err)); // eslint-disable-line no-console

  client.on('error', (err) => {
    console.error(err); // eslint-disable-line no-console
    return Promise.reject(new Error('Unable to connect to redis'));
  });

  if (!module.parent) {
    app.listen(config.port, () => {
      console.info(`API started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
    });
  }
});
module.exports = app;
