const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');
const Promise = require('bluebird');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Create and query movies by year', () => {
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 50 new movies in year 2002', (done) => {
      Promise.map(createMovies(50, { year: '2002' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.year).to.equal('2002');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=2002&limit=50`, () => {
    it('should return an array with 50 2002 movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=2002&limit=50`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].year).to.equal('2002');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=2002&limit=50&page=1`, () => {
    it('should return an array with 50 2002 movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=2002&limit=50&page=1`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].year).to.equal('2002');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=2002&limit=25&page=2`, () => {
    it('should return an array with 25 2002 movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=2002&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].year).to.equal('2002');
          done();
        })
        .catch(done);
    });
  });
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 31 new movies in year 1980', (done) => {
      Promise.map(createMovies(31, { year: '1980' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.year).to.equal('1980');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=1980&limit=31`, () => {
    it('should return an array with 31 1980 movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=1980&limit=31`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(31);
          expect(res.body.limit).to.equal(31);
          expect(res.body.movies.length).to.equal(31);
          expect(res.body.movies[0].year).to.equal('1980');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[year]=2002&limit=25&page=2`, () => {
    it('should still return an array with 25 2002 movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[year]=2002&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].year).to.equal('2002');
          done();
        })
        .catch(done);
    });
  });
});
