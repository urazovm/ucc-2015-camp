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
        this.ractive.on('startEstimationSession', () => this.startEstimationSession(event, this.ractive.get('estimationSessionName')));
        this.ractive.on('addEstimationTask', () => this.addEstimationTask(event, this.ractive.get('estimationTask')));
        this.ractive.on('estimateTask', () => this.estimateTask(event,name));
        this.ractive.on('runSession', () => this.runSession());
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

    startEstimationSession(event, name) {

      this.setProcessStep('addTask');
      event.preventDefault();


        this.estimationSession.create(name)
            .then(() => {
                this.ractive.set('sessionStarted', true);
                this.ractive.set('estimationSession', this.estimationSession.session);
                console.log(this.estimationSession.session)
                this.socket.on('estimate-'+this.estimationSession.session.id, (sessionId) => {
                    this.estimationSession.get(sessionId).then((data) =>{
                        console.log('got the updated session', data);
                        this.estimationSession.session = data;
                        console.log(this.estimationSession.session)
                        this.ractive.set('estimationSession', this.estimationSession.session);

                    });

                });
            });

    }


    addEstimationTask(event, taskName) {

        console.log('adding estimationTask');
        event.preventDefault();

        this.estimationSession.addTask(taskName).then(() => {
            this.ractive.set('estimationTasks', this.estimationSession.session.items);
        });

        this.ractive.set('estimationTask', null);

    }

    getEstimationTasks() {
      this.ractive.set('estimationTasks', this.estimationSession.session.items);
    }

    setProcessStep(processStep) {
      this.processStep = processStep;
      this.ractive.set('processStep', processStep);
    }

    runSession() {
      this.getEstimationTasks();
      this.setProcessStep('runSession');
    }


    estimateTask(e,task){
        this.estimationSession.startTask(task);
    }


}

export default Welcome;
