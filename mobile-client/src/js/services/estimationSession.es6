import _ from 'lodash';

class EstimationSession {

    constructor(http, store, events, configuration) {
        this.store = store;
        this.http = http;
        this.events = events;
        this.configuration = configuration;
    }

    getSessionFromName(sessionName){
        return this.http.get(this.configuration.api + '/sessions?q=' + sessionName).then(
            (response) => {
                return response.data.sessions[0].session.id;

            }, (errorResponse) => {
                console.log('FAILURE when looking up session by name');
            });
    }

    getItem(sessionId, itemId){
        if(!sessionId){
            sessionId = this.store.local.get('sessionId');
        }
        if(itemId){
            return this.http.get(this.configuration.api + '/sessions/' + sessionId+"/items/"+itemId).then(
                (response) => {
                    console.log('estsessionclass');
                    console.log(response);
                    return response.data;
                }, (errorResponse) => {
                    console.log('FAILURE  when getting item');
                });
        }
    }
    get(sessionId) {
        console.log('get session');
        if (arguments.length !== 1) sessionId = this.store.local.get('sessionId');
        console.log(sessionId);
        return this.http.get(this.configuration.api + '/sessions/' + sessionId).then(
            (sessionResponse) => {
                return this.http.get(this.configuration.api + sessionResponse.data._links.items.href).then((itemsResponse) =>{
                        let sessionWithItems = _.extend(sessionResponse.data.session, {items: itemsResponse.data.items});
                        console.log(sessionWithItems);
                        return sessionWithItems;
                    }
                )
            }, (errorResponse) => {
                console.log('FAILURE  when joining session');
            });
    }

    submitEstimateFor(item, itemEstimate) {
        let payload = {estimate: itemEstimate};
        console.log(item)
        return this.http.post(this.configuration.api + item._links.estimates.href, payload).then(
            (response) => {
                return response.data;
            }, (errorResponse) => {
                console.log('FAILURE  when sending estimate');
            });
    }


    submitEstimateForActiveItem(itemEstimate) {
        return this.get().then(
            (response) => {
                console.log(response)
                console.log(itemEstimate)
                return this.submitEstimateFor(response.activeItem, itemEstimate);
            }, (errorResponse) => {
                console.log('FAILURE  when getting session');
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