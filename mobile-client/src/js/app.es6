import configuration from 'configuration';

import io from 'socket.io-client';
import Logdown  from 'logdown';

import Parsely from 'parsleyjs'; // initialise Parsley
import Bootstrap from 'bootstrap'; // initialise Bootstrap

import Ractive from 'ractive';
Ractive.DEBUG = true;

import parsleyDecorator from './services/parsley-ractive-decorator.es6';
Ractive.decorators.parsley = parsleyDecorator;

import Router from './services/router.es6';
import events from './services/events.es6';
import storage from './services/storage.es6';
import EstimationSession from './services/estimationSession.es6';
import axios from 'axios';

import Welcome from './welcome/welcome.es6';
import Home from './home/home.es6';
import Sorry from './sorry/sorry.es6';
import NotFound from './404/404.es6';

let logger = new Logdown({prefix: 'app'});
let estimationSession = new EstimationSession(axios, storage, events, configuration);
let router = new Router(estimationSession, events);

axios.interceptors.request.use(function(config) {
  let accessToken = storage.local.get('accessToken');
  if (accessToken) config.headers['X-estimationSession-Token'] = accessToken;
  else delete config.headers['X-estimationSession-Token'];
  return config;
});

let socket = io(configuration.api);

router.addRoute('home', new Home(estimationSession, events));
router.addRoute('welcome', new Welcome(estimationSession, events));
router.addRoute('sorry', new Sorry());
router.addRoute('404', new NotFound());
router.initialise();
router.transitionTo('home');

console.log('router init');
events.estimationSession.restoredLogin.add(function(err, user) {
  let page = 'welcome';

  if (err && err.status === 401) {
    logger.warn('a failed login attempt has been made');
    return router.transitionTo('home')
  }

  if (err) {
    logger.warn('connection to the API has been lost');
    return router.transitionTo('sorry')
  }

  logger.log('the login credentials have been restored');
  router.transitionTo(page);
});

events.routing.accessDenied.add(function(path) {
  logger.warn('the access to `' + path + '` has been denied');
  router.transitionTo('home');
});

events.routing.notFound.add(function() {
  logger.log('the entered path could not be found');
  router.transitionTo('404');
});

events.routing.transitionTo.add(function(path, view) {
  logger.log('transitioning to `' + path + '`');
  view.unrender().then(function() {
    router.transitionTo(path);
  });

});
console.log('end of app.js')