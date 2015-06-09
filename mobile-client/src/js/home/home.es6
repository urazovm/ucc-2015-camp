import Ractive from 'ractive';
import html from './home.ract'

class Home {

    constructor(estimationSession, events, router) {
        this.estimationSession = estimationSession;
        this.events = events;
        this.router = router;
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
            this.router.transitionTo('estimate');
        });
    }

    getSession(sessionId) {


        this.estimationSession.get(sessionId)
            .then((data) => {
                console.log('SUCCESS');
                console.log(data)
            },
            (err) => this.showError(err));


    }

    showError(err) {
        this.ractive.set('showError', true);
    }

    isProtected() {
        return false;
    }

    unrender() {
        return this.ractive.teardown();
    }
}

export default Home;