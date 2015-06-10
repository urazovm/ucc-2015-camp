import Ractive from 'ractive';
import html from './home.ract'

class Home {

    constructor(estimationSession, events, router) {
        this.estimationSession = estimationSession;
        this.events = events;
        this.router = router;
    }

    render() {
        this.ractive = new Ractive({
            el: 'view',
            template: html,
            data: {
                showError: false
            }
        });

        this.ractive.on('sessionInteractive', () => {
            let sessionName = this.ractive.get('sessionName');
            this.getSession(sessionName);
            this.router.transitionTo('estimate');
        });
        this.ractive.on('sessionList', () => {
            let sessionName = this.ractive.get('sessionName');
            this.getSession(sessionName).then((data)=>{
                this.router.transitionTo('list');

            });
        });
    }

    getSession(sessionName) {


        return this.estimationSession.get(sessionName)
            .then((data) => {
                return data;
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