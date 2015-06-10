import _ from 'lodash';

class EstimationSession {

    constructor(http, store, events, configuration) {
        this.store = store;
        this.http = http;
        this.events = events;
        this.configuration = configuration;
    }


    getItem(sessionName, itemId){
        if(!sessionName){
            sessionName = this.store.local.get('sessionName');
        }
        if(itemId){
            return this.http.get(this.configuration.api + '/sessions/' + sessionName+"/items/"+itemId).then(
                (response) => {
                    return response.data;
                }, (errorResponse) => {
                    alert('catastrophic failure when getting item');
                });
        }
    }
    get(sessionName) {
        console.log('get session');
        if (arguments.length !== 1) sessionName = this.store.local.get('sessionName');
        return this.http.get(this.configuration.api + '/sessions/' + sessionName).then(
            (response) => {
                this.store.local.set('sessionName', sessionName);
                return response.data;

            }, (errorResponse) => {
                alert('catastrophic failure when joining session');
            });
    }

    submitEstimateFor(item, itemEstimate) {
        let payload = {estimate: itemEstimate};
console.log(item)
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
        console.log('submitEstimateForActiveItem')
        return this.get().then(
            (response) => {
                console.log(response)
                console.log(itemEstimate)
                return this.submitEstimateFor(response.activeItem, itemEstimate);
            }, (errorResponse) => {
                alert('catastrophic failure when getting session');
            });
    }

    clear() {
        this.store.local.remove('sessionName');
    }

    getId() {
        return this.store.local.get('sessionName');
    }
}

export default EstimationSession;