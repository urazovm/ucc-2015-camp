import _ from 'lodash';

class EstimationSession {

    constructor(http, store, events, configuration) {
        this.store = store;
        this.http = http;
        this.events = events;
        this.configuration = configuration;
    }

    get(sessionId) {
        return this.http.get(this.configuration.api + '/sessions/' + sessionId).then(
            (response) => {
                this.store.local.set('sessionId', sessionId);
                return response.data;

            }, (errorResponse) => {
                alert('catastrophic failure when joining session');
            });
    }

    submitEstimate(itemEstimate) {
        let payload = {estimate: itemEstimate};
        let sessionId = this.store.local.get('sessionId');

        return this.get(sessionId).then(
            (response) => {
                let estimateLink = _.first(_.filter(response.activeItem.links, function(link){
                    return link.rel === 'estimate';}
                ));
                return this.http.post(this.configuration.api+ estimateLink.href, payload).then(
                    (response) => {
                        return response.data;
                    }, (errorResponse) => {
                        alert('catastrophic failure when sending estimate');
                    });

            }, (errorResponse) => {
                alert('catastrophic failure when getting session');
            });


    }

    clear() {
        this.store.local.remove('sessionId');
    }

    getId() {
        return this.store.local.get('sessionId');
    }
}

export default EstimationSession;