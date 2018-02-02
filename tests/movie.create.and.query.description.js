const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');
const Promise = require('bluebird');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Create and query movies by description', () => {
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 50 new movies with Very fun as description', (done) => {
      Promise.map(createMovies(50, { description: 'Very fun' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.description).to.equal('Very fun');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=Very fun&limit=50`, () => {
    it('should return an array with 50 Very fun movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=Very fun&limit=50`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].description).to.equal('Very fun');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=Very fun&limit=50&page=1`, () => {
    it('should return an array with 50 Very fun movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=Very fun&limit=50&page=1`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].description).to.equal('Very fun');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=Very fun&limit=25&page=2`, () => {
    it('should return an array with 25 Very fun movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=Very fun&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].description).to.equal('Very fun');
          done();
        })
        .catch(done);
    });
  });
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 18 new movies with Not so fun as description', (done) => {
      Promise.map(createMovies(18, { description: 'Not so fun' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.description).to.equal('Not so fun');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=Not so fun&limit=18`, () => {
    it('should return an array with 18 Not so fun movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=Not so fun&limit=18`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(18);
          expect(res.body.limit).to.equal(18);
          expect(res.body.movies.length).to.equal(18);
          expect(res.body.movies[0].description).to.equal('Not so fun');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[description]=Very fun&limit=25&page=2`, () => {
    it('should still return an array with 25 Very fun movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[description]=Very fun&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].description).to.equal('Very fun');
          done();
        })
        .catch(done);
    });
  });
});
