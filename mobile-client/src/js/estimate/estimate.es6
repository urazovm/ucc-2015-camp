import Ractive from 'ractive';
import html from './estimate.ract'

class Estimate {

    constructor(estimationSession, events, router) {
        this.estimationSession = estimationSession;
        this.events = events;
        this.router = router;
    }

    render(optionalItemId) {
        if (optionalItemId) {
            this.estimationSession.getItem(null, optionalItemId).then((data) => {
                this.selectedItem = data;
                this.ractive = new Ractive({
                    el: 'view',
                    template: html,
                    data: {
                        showError: false,
                        selectedItemVisible: true,
                        selectedItem: data
                    }
                });
                this.ractive.on('submitEstimate', () => {
                    let itemEstimate = this.ractive.get('itemEstimate');
                    this.submitEstimate(itemEstimate);
                });
            });

        } else {
            this.ractive = new Ractive({
                el: 'view',
                template: html,
                data: {
                    showError: false,
                    selectedItemVisible: false
                }
            });
            this.ractive.on('submitEstimate', () => {
                let itemEstimate = this.ractive.get('itemEstimate');
                this.submitEstimate(itemEstimate);
            });
        }


    }

    submitEstimate(itemEstimate) {
        console.log('hello')
        if (this.selectedItem) {
            this.estimationSession.submitEstimateFor(this.selectedItem, itemEstimate)
                .then((data) => {
                    this.ractive.set('itemEstimate', '');
                },
                (err) => this.showError(err));
        }
        this.estimationSession.submitEstimateForActiveItem(itemEstimate)
            .then((data) => {
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

export default Estimate;