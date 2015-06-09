import _ from 'lodash';

class EstimationSession {

    constructor(http, store, events, configuration) {
        this.store = store;
        this.http = http;
        this.events = events;
        this.configuration = configuration;
    }


    getItem(sessionId, itemId){
        if(!sessionId){
            sessionId = this.store.local.get('sessionId');
        }
        if(itemId){
            return this.http.get(this.configuration.api + '/sessions/' + sessionId+"/items/"+itemId).then(
                (response) => {
                    return response.data;
                }, (errorResponse) => {
                    alert('catastrophic failure when getting item');
                });
        }
    }
    get(sessionId) {
        if (arguments.length !== 1) sessionId = this.store.local.get('sessionId');
        return this.http.get(this.configuration.api + '/sessions/' + sessionId).then(
            (response) => {
                this.store.local.set('sessionId', sessionId);
                return response.data;

            }, (errorResponse) => {
                alert('catastrophic failure when joining session');
            });
    }

    submitEstimateFor(item, itemEstimate) {
        let payload = {estimate: itemEstimate};

        let estimateLink = _.first(_.filter(item.links, function(link){
                return link.rel === 'estimate';}
        ));
        return this.http.post(this.configuration.api + estimateLink.href, payload).then(
            (response) => {
                return response.data;
            }, (errorResponse) => {
                alert('catastrophic failure when sending estimate');
            });


    }


    submitEstimateForActiveItem(itemEstimate) {
        return this.get().then(
            (response) => {
                return this.submitEstimateFor(response.activeItem, itemEstimate);
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