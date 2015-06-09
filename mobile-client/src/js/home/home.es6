import Ractive from 'ractive';
import html from './home.ract'

class Home {

  constructor(estimationSession, events) {
    this.estimationSession = estimationSession;
    this.events = events;
    console.log('home constructor invoked')
  }

  render() {
    console.log('home render called');
    this.ractive = new Ractive({
      el: 'view',
      template: html,
      data: {
        showError: false
      }
    });

    this.ractive.on('signIn', () => {
      let sessionId = this.ractive.get('sessionId');
      this.getSession(sessionId);
    });
  }

  getSession(sessionId) {



  this.estimationSession.join(sessionId)
      .then((data) => {
          console.log('SUCCESS');
          console.log(data)},
            (err) => this.showError(err));



}

  showError(err) {
    this.ractive.set('showError', true);
  }

  goToWelcomeScreen() {
    this.events.routing.transitionTo.dispatch('welcome', this);
  }

  isProtected() {
    return false;
  }

  unrender() {
    return this.ractive.teardown();
  }
}

export default Home;