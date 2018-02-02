const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');
const Promise = require('bluebird');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Create and query movies by director', () => {
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 50 Steven Spielberg movies', (done) => {
      Promise.map(createMovies(50, { director: 'Steven Spielberg' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.director).to.equal('Steven Spielberg');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=Steven Spielberg&limit=50`, () => {
    it('should return an array with 50 Steven Spielberg movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=Steven Spielberg&limit=50`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].director).to.equal('Steven Spielberg');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=Steven Spielberg&limit=50&page=1`, () => {
    it('should return an array with 50 Steven Spielberg movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=Steven Spielberg&limit=50&page=1`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].director).to.equal('Steven Spielberg');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=Steven Spielberg&limit=25&page=2`, () => {
    it('should return an array with 25 Steven Spielberg movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=Steven Spielberg&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].director).to.equal('Steven Spielberg');
          done();
        })
        .catch(done);
    });
  });
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 37 new Alfred Hitchcock movies', (done) => {
      Promise.map(createMovies(37, { director: 'Alfred Hitchcock' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.genre).to.equal(movie.genre);
            expect(res.body.director).to.equal('Alfred Hitchcock');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=Alfred Hitchcock&limit=37`, () => {
    it('should return an array with 37 Alfred Hitchcock movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=Alfred Hitchcock&limit=37`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(37);
          expect(res.body.limit).to.equal(37);
          expect(res.body.movies.length).to.equal(37);
          expect(res.body.movies[0].director).to.equal('Alfred Hitchcock');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[director]=Steven Spielberg&limit=25&page=2`, () => {
    it('should still return an array with 25 Steven Spielberg movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[director]=Steven Spielberg&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].director).to.equal('Steven Spielberg');
          done();
        })
        .catch(done);
    });
  });
});
