process.env.NODE_ENV = 'test';

var should = require('should');
var request = require('supertest');
var kill = require('./helper');
var User = require('../src/model/user');
var traceur = require('traceur');
traceur.require.makeDefault(function(file) {
  return file.endsWith('.es6');
});

describe('GET /login', function() {

  var app;

  beforeEach(function(done) {
    kill.mongo('mongodb://localhost/ucc-2015-camp-test').then(function() {
      app = require('../src/app.es6');
      done();
    });
  });

  it('should respond with a 500 if the request does not match the schema', function(done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'foobar@example.com'})
      .expect('Content-Type', /json/)
      .expect(500, done);
  });

  it('should respond with a 401', function(done) {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'foobar@example.com', password: 'fhfhf'})
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('should respond with a 200', function(done) {
    new User({username: 'foobar@example.com', password: 'password'}).save();
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'foobar@example.com', password: 'password'})
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should respond with a 200 and a auth token', function(done) {
    new User({username: 'foobar@example.com', password: 'password'}).save();
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({username: 'foobar@example.com', password: 'password'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('accessToken');
        done();
      });
  });

});