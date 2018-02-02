const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Movies APIs', () => {
  const movie = createMovies()[0];
  const query = `?filter[title]=${movie.title}&filter[description]=${movie.description}&` +
    `filter[genre]=${movie.genre}&filter[director]=${movie.director}`;
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create a new movie', (done) => {
      request(app)
        .post(`${config.basePath}movies`)
        .send(movie)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.title).to.equal(movie.title);
          expect(res.body.description).to.equal(movie.description);
          expect(res.body.genre).to.equal(movie.genre);
          expect(res.body.director).to.equal(movie.director);
          expect(res.body.year).to.equal(movie.year);
          done();
        })
        .catch(done);
    });
    it('should return error for trying to create the same movie', (done) => {
      request(app)
        .post(`${config.basePath}movies`)
        .send(movie)
        .expect(httpStatus.CONFLICT)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies`, () => {
    it('should return an array with all movies', (done) => {
      request(app)
        .get(`${config.basePath}movies`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies`, () => {
    it('should return an array with all cached movies', (done) => {
      request(app)
        .get(`${config.basePath}movies`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies/?filter[title]=${movie.title}`, () => {
    it('should return movies filtered by title', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[title]=${movie.title}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies[0].title).to.equal(movie.title);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=${movie.description}`, () => {
    it('should return movies filtered by description', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=${movie.description}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies[0].description).to.equal(movie.description);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=${movie.genre}`, () => {
    it('should return movies filtered by genre', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=${movie.genre}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies[0].genre).to.equal(movie.genre);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movie.director}`, () => {
    it('should return movies filtered by director', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movie.director}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies[0].director).to.equal(movie.director);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=${movie.year}`, () => {
    it('should return movies filtered by year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=${movie.year}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies[0].year).to.equal(movie.year);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/${query}`, () => {
    it('should return 1 random movie filtered by all its attributes', (done) => {
      request(app)
        .get(`${config.basePath}movies/${query}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(res.body.movies.length);
          expect(res.body.movies).to.be.an('array');
          expect(res.body.movies.length).to.equal(1);
          expect(res.body.movies[0].title).to.equal(movie.title);
          expect(res.body.movies[0].description).to.equal(movie.description);
          expect(res.body.movies[0].genre).to.equal(movie.genre);
          expect(res.body.movies[0].director).to.equal(movie.director);
          expect(res.body.movies[0].year).to.equal(movie.year);
          done();
        })
        .catch(done);
    });
  });
});
