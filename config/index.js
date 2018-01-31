const Joi = require('joi');

require('dotenv').config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test'])
    .default('development'),
  BASE_PATH: Joi.string()
    .default('/'),
  PROXY_PATH: Joi.string()
    .default(''),
  PORT: Joi.number()
    .default(3000),
  REDIS_HOST: Joi.string()
    .required(),
  REDIS_MAX_MEMORY: Joi.number()
    .default(0),
  REDIS_DB_INDEX: Joi.string()
    .default('0'),
  MONGO_HOST: Joi.string()
    .description('Mongo DB host url')
    .required(),
  MONGO_DB_NAME: Joi.string()
    .description('Mongo DB host name')
    .default('movies-api'),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongo: {
    host: envVars.MONGO_HOST,
    name: envVars.MONGO_DB_NAME
  },
  redis: {
    host: envVars.REDIS_HOST,
    index: envVars.REDIS_DB_INDEX,
    maxMemory: envVars.REDIS_MAX_MEMORY,
  },
  basePath: envVars.BASE_PATH,
  proxyPath: envVars.PROXY_PATH
};

module.exports = config;
