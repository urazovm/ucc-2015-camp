process.env.NODE_ENV = 'test';

var request = require('supertest');
var app = require('../src/app.js');

describe('GET /login', function() {

  it('should respond with a 401', function(done) {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

});