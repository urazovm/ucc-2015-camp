import Ractive from 'ractive';
import html from './list.ract'

class List {

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

console.log('TODO Fix list constructor')
        this.estimationSession.get().then((data) => {
            console.log('got seesion back to list');
            console.log(data);

            this.ractive.set('estimationSession', data);
        });

        this.ractive.on('viewItem', (event,item) => {
            console.log(item)
            this.router.transitionTo('estimate/'+  item.id);
        });
    }

    unrender() {
        return this.ractive.teardown();
    }

    isProtected() {
        return false;
    }
}

export default List;
