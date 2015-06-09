import axios from 'axios';

import EstimationSession from 'services/estimationSession.es6';
import storage from 'services/storage.es6';
import events from 'services/events.es6';
import Home from 'home/home.es6';

describe('The Home View', function() {

  let estimationSession, home;

  beforeEach(function() {
    estimationSession = new EstimationSession(axios, storage, events);
    home = new Home(estimationSession, events);
  });

  it('should render', function() {
    home.render();
    expect(home.ractive).toBeDefined();
  });

});