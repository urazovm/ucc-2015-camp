import Ractive from 'ractive';
import html from './estimate.ract'

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

        this.ractive.on('submitEstimate', () => {
            let itemEstimate = this.ractive.get('itemEstimate');
            this.submitEstimate(itemEstimate);

        });
    }

    submitEstimate(itemEstimate) {


        this.estimationSession.submitEstimate(itemEstimate)
            .then((data) => {
                console.log('SUCCESS');
                console.log(data)
                this.ractive.set('itemEstimate', '');
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