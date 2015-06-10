import Ractive from 'ractive';
import html from './welcome.ract';
import navbar from '../navbar/navbar.ract';
import storage from '../services/storage.es6';

class Welcome {




    constructor(auth, events, estimationSessions) {
        this.events = events;
        this.auth = auth;
        this.estimationSession = estimationSessions;
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


    }

    estimateTask(e,task){

        this.estimationSession.startTask(task);
    }

}

export default Welcome;
