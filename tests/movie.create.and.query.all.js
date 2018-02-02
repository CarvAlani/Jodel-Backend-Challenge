const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');
const Promise = require('bluebird');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Create and query movies by all', () => {
  const movieAttributes = {
    year: '2010',
    description: 'testing all',
    director: 'Dean Winchester',
    genre: 'Drama'
  };
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 50 new movies', (done) => {
      Promise.map(createMovies(50), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.year).to.equal(movie.year);
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
    it('should create 20 new movies with same attributes except title', (done) => {
      Promise.map(createMovies(20, movieAttributes), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movieAttributes.description);
            expect(res.body.director).to.equal(movieAttributes.director);
            expect(res.body.genre).to.equal(movieAttributes.genre);
            expect(res.body.year).to.equal(movieAttributes.year);
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies/?limit=70`, () => {
    it('should return an array with 70 movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?limit=70`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(70);
          expect(res.body.count).to.equal(70);
          expect(res.body.limit).to.equal(70);
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies/?limit=15&page=4`, () => {
    it('should return an array with 15 movies in page 4', (done) => {
      request(app)
        .get(`${config.basePath}movies/?limit=15&page=4`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(4);
          expect(res.body.movies.length).to.equal(15);
          expect(res.body.count).to.equal(15);
          expect(res.body.limit).to.equal(15);
          done();
        })
        .catch(done);
    });
  });

  describe(`# GET ${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[description]=${movieAttributes.description}`, () => {
    it('should return an array with same genre and description', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[description]=${movieAttributes.description}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[director]=${movieAttributes.director}`, () => {
    it('should return an array with same genre and director', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[director]=${movieAttributes.director}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[year]=${movieAttributes.year}`, () => {
    it('should return an array with same genre and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=${movieAttributes.genre}&filter[year]=${movieAttributes.year}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}`, () => {
    it('should return an array with same director and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=${movieAttributes.description}&filter[year]=${movieAttributes.year}`, () => {
    it('should return an array with same description and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=${movieAttributes.description}&filter[year]=${movieAttributes.year}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}`, () => {
    it('should return an array with same director and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[description]=${movieAttributes.description}`, () => {
    it('should return an array with same director, description and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[description]=${movieAttributes.description}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[genre]=${movieAttributes.genre}`, () => {
    it('should return an array with same director, genre and year', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[genre]=${movieAttributes.genre}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[genre]=${movieAttributes.genre}&filter[description]=${movieAttributes.description}`, () => {
    it('should return an array with same attributes', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=${movieAttributes.director}&filter[year]=${movieAttributes.year}&filter[genre]=${movieAttributes.genre}&filter[description]=${movieAttributes.description}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.movies.length).to.equal(10);
          done();
        })
        .catch(done);
    });
  });
});
