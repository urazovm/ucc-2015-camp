process.env.NODE_ENV = 'test';

var request = require('supertest');
var kill = require('./helper');

describe('GET /login', function() {

  var app;

  beforeEach(function(done) {
    kill.mongo('mongodb://localhost/ucc-2015-camp-test').then(function() {
      app = require('../src/app.js');
      done();
    });
  });

  it('should respond with a 401', function(done) {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

});