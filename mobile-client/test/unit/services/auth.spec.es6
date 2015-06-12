import axios from 'axios';

import EstimationSession from 'services/estimationSession.es6';
import storage from 'services/storage.es6';
import events from 'services/events.es6';

describe('The Estimation Session Service', function() {

  let estimationSession;

  beforeEach(function() {
    estimationSession = new EstimationSession(axios, storage, events, {api: 'http://foobar.com'});
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  //it('should get a list of items successfully', function(done) {
  //  jasmine.Ajax.stubRequest('http://foobar.com/sessions/mySession').andReturn({
  //    'status': 200,
  //    'contentType': 'application/json',
  //    'responseText': JSON.stringify({
  //      'items' : []
  //    })
  //  });
  //
  //  estimationSession.join('mySession').then((sessionId) => {
  //    expect(storage.local.get('sessionId')).toBe('mySession');
  //    done();
  //  });
  //});
});