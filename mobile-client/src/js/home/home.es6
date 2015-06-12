import Ractive from 'ractive';
import html from './home.ract'

class Home {

    constructor(estimationSession, events, router,store) {
        this.store = store;
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

        //this.ractive.on('sessionInteractive', () => {
        //    let sessionName = this.ractive.get('sessionName');
        //    this.getSession(sessionName);
        //    this.router.transitionTo('estimate');
        //});

        this.ractive.on('sessionList', () => {
            let sessionName = this.ractive.get('sessionName');

            console.log('sessionlist');
            this.getSessionIdFromName(sessionName).then((data)=>{
                if(typeof data === 'undefined') return null;
                console.log(data);
                console.log('STOP')
                this.router.transitionTo('list');
            });
        });
    }

    getSessionIdFromName(sessionName) {
        return this.estimationSession.getSessionFromName(sessionName)
            .then((sessionId) => {
                console.log('asdfsadf')

                this.store.local.set('sessionId', sessionId)
                console.log('set session id:' + this.store.local.get('sessionId'))
                return {};
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
