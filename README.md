# Movies API

Simple NodeJS REST API for movies, built using [express.js](https://expressjs.com/) framework, which
has two endpoints:

- Create a new movie `POST /movies`
  - Input:
    - JSON Object
      - properties:
          title:
            type: string
          description:
            type: string
          genre:
            type: string
          director:
            type: string
          year:
            type: string
  - Output:
    - 200 OK or error code

- Getting all movies `GET /movies`:
  - Input:
    - filter object (optional)
    - page number
    - limit per page (N)
  - Output:
    - list of movies (no more than N)


## Filter
This app allows filter by multiple attributes, an example of it is `GET /movies?filter[year]=2002&filter[genre]=Action`

## Deployment and Running

### Running whitout docker

In order to deploy and run this API whitout using docker, MongoDB and Redis should be installed in
the target host. Then just `npm install` and `npm start`. There are 2 environment variables required:
`MONGO_HOST` and `REDIS_HOST`, they can be stored in a `.env` file.

### Running whit docker

This projects uses [Docker Compose](https://docs.docker.com/compose/) for definning and running
multiple docker containers. There are 3 containers used: A container for MongoDB, another for Redis
and finally one for the app. For building and deploy the project just `docker-compose build` and
then `MONGO_DB_NAME=movies-api REDIS_DB_INDEX=0 docker-compose up`

## Cache

This app uses a Redis instance in order of creating a cache for recent queries. This instance has a limit of available memory (that can be changed through env variables) and deletes less recently used keys when that limit is reached. This cache is emptied after a new registry is created, choosing consistency over fast results.

## Tests

Tests are done using [Mocha](https://mochajs.org/) just by running the command `npm run test`
or `MONGO_DB_NAME=movies-api-test REDIS_DB_INDEX=1 docker-compose run web yarn test`

## Documentation

Even though this is a small app with only 2 endpoints, it's always good to have enpoints well documented. In order to do that this project contains an endpoint with the help of Swagger that expose the usage of the API in `/docs`