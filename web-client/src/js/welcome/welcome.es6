import Ractive from 'ractive';
import html from './welcome.ract';
import navbar from '../navbar/navbar.ract';
import storage from '../services/storage.es6';
import io from 'socket.io-client';

class Welcome {


    constructor(auth, events, estimationSessions, socket) {
        this.events = events;
        this.auth = auth;
        this.estimationSession = estimationSessions;
        this.socket = socket;
        this.socket.on('estimateUpdated', (res) => {
            console.log(res.session);
            this.estimationSession.updateSession(res.session);
            this.ractive.set('estimationSession', this.estimationSession.session);
        });
    }

    render() {
        let loggedInUser = storage.memory.get('user');
        this.ractive = new Ractive({
            el: 'view',
            template: html,
            partials: {navbar: navbar},
            data: function () {
                return {
                    user: loggedInUser,
                    sessionStarted: false
                };
            }
        });
        this.setProcessStep('createSession');

        this.ractive.on('logout', () => this.logout());
        this.ractive.on('startEstimationSession', () => this.startEstimationSession(this.ractive.get('estimationSessionName')));
        this.ractive.on('addEstimationTask', () => this.addEstimationTask(this.ractive.get('estimationTask')));
        this.ractive.on('estimateTask', () => this.estimateTask(event,name));
    }

    logout() {
        this.auth.clearLogin();
        this.events.routing.transitionTo.dispatch('home', this);
    }

    isProtected() {
        return true;
    }

    unrender() {
        this.events.sms.receivedSms.removeAll();
        return this.ractive.teardown();
    }

    startEstimationSession(name) {

      this.setProcessStep('addTask')

        this.estimationSession.create(name)
            .then(() => {
                this.ractive.set('sessionStarted', true);
                this.ractive.set('estimationSession', this.estimationSession.session);
            });
    }


    addEstimationTask(taskName) {

        this.estimationSession.addTask(taskName).then(() => {
            this.ractive.set('estimationTasks', this.estimationSession.session.items);
        });

        this.ractive.set('estimationTask', null);

    }

    setProcessStep(processStep) {
      this.processStep = processStep;
      this.ractive.set('processStep', processStep);
    }

    startSession(e, task) {
      return true;
    }


    estimateTask(e,task){

        this.estimationSession.startTask(task);
    }
// =======
//   constructor(auth, events, estimationSessions, socket) {
//     this.events = events;
//     this.auth = auth;
//     this.estimationSession = estimationSessions;
//     this.socket = socket;
//     this.socket.on('estimateUpdated', function(msg) {
//       //TODO update the UI when new estimates are submitted
//       console.log(msg)
//     });
//   }

//   render() {
//     let loggedInUser = storage.memory.get('user');
//     this.ractive = new Ractive({
//       el: 'view',
//       template: html,
//       partials: {navbar: navbar},
//       data: function() {
//         return {
//           user: loggedInUser,
//           sessionStarted: false
//         };
//       }
//     });

//     this.ractive.on('logout', () => this.logout());
//     this.ractive.on('startEstimationSession', () => this.startEstimationSession(this.ractive.get('estimationSessionName')));
//     this.ractive.on('addEstimationTask', () => this.addEstimationTask(this.ractive.get('estimationTask')));
//     this.ractive.on('estimateTask', () => this.estimateTask(event, name));
//   }

//   logout() {
//     this.auth.clearLogin();
//     this.events.routing.transitionTo.dispatch('home', this);
//   }

//   isProtected() {
//     return true;
//   }

//   unrender() {
//     return this.ractive.teardown();
//   }

//   startEstimationSession(name) {
//     this.estimationSession.create(name)
//       .then(() => {
//         this.ractive.set('sessionStarted', true);
//         this.ractive.set('estimationSession', this.estimationSession.session);
//       });
//   }

//   addEstimationTask(taskName) {
//     this.estimationSession.addTask(taskName).then(() => {
//       this.ractive.set('estimationTasks', this.estimationSession.session.items);
//     });
//   }

//   estimateTask(e, task) {
//     this.estimationSession.startTask(task);
//   }
// >>>>>>> 324cd0eef9d2fd3619f3bd1b34e4e4a93648b117

}

export default Welcome;
