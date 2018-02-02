const request = require('supertest');
const httpStatus = require('http-status');
const chai = require('chai');
const app = require('../index');
const config = require('../config');
const { createMovies } = require('../helpers/utils');
const Promise = require('bluebird');

const expect = chai.expect; // eslint-disable-line prefer-destructuring

chai.config.includeStack = true;

describe('## Create and query movies by genre', () => {
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 50 new Action movies', (done) => {
      Promise.map(createMovies(50, { genre: 'Action' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.genre).to.equal('Action');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=Action&limit=50`, () => {
    it('should return an array with 50 Action movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=Action&limit=50`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].genre).to.equal('Action');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=Action&limit=50&page=1`, () => {
    it('should return an array with 50 Action movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=Action&limit=50&page=1`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(50);
          expect(res.body.limit).to.equal(50);
          expect(res.body.movies.length).to.equal(50);
          expect(res.body.movies[0].genre).to.equal('Action');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=Action&limit=25&page=2`, () => {
    it('should return an array with 25 Action movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=Action&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].genre).to.equal('Action');
          done();
        })
        .catch(done);
    });
  });
  describe(`# POST ${config.basePath}movies`, () => {
    it('should create 27 new Supernatural movies', (done) => {
      Promise.map(createMovies(27, { genre: 'Supernatural' }), movie =>
        request(app)
          .post(`${config.basePath}movies`)
          .send(movie)
          .then((res) => {
            expect(res.body.title).to.equal(movie.title);
            expect(res.body.description).to.equal(movie.description);
            expect(res.body.director).to.equal(movie.director);
            expect(res.body.year).to.equal(movie.year);
            expect(res.body.genre).to.equal('Supernatural');
            return Promise.resolve();
          }))
        .then(() => done())
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=Supernatural&limit=27`, () => {
    it('should return an array with 27 Supernatural movies', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=Supernatural&limit=27`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(1);
          expect(res.body.count).to.equal(27);
          expect(res.body.limit).to.equal(27);
          expect(res.body.movies.length).to.equal(27);
          expect(res.body.movies[0].genre).to.equal('Supernatural');
          done();
        })
        .catch(done);
    });
  });
  describe(`# GET ${config.basePath}movies/?filter[genre]=Action&limit=25&page=2`, () => {
    it('should still return an array with 25 Action movies in second page', (done) => {
      request(app)
        .get(`${config.basePath}movies/?filter[genre]=Action&limit=25&page=2`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.page).to.equal(2);
          expect(res.body.count).to.equal(25);
          expect(res.body.limit).to.equal(25);
          expect(res.body.movies.length).to.equal(25);
          expect(res.body.movies[0].genre).to.equal('Action');
          done();
        })
        .catch(done);
    });
  });
});
