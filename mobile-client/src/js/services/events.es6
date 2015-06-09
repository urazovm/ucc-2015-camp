import signals from 'signals';

class Events {
  constructor() {
    this.http = {
      failedRequest: new signals.Signal()
    };

    this.routing = {
      transitionTo: new signals.Signal(),
      accessDenied: new signals.Signal(),
      notFound: new signals.Signal()
    };

    this.estimationSession = {
      restoredLogin: new signals.Signal()
    };
  }
}

export default new Events();