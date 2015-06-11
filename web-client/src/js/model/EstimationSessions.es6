import _ from "lodash"

class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.session = {};
    }


    create(sessionName) {

        return this.http.post(this.configuration.api + '/sessions', {name : sessionName}).then((response) => {
             return this.http.get(this.configuration.api +response.data).then((newSession)=>{
                 this.session = _.extend(newSession.data.session,{
                     _links:newSession.data._links
                         });
             });

        });
    }

    addTask(taskName){
        console.log('estimclass.addtaks', taskName)
        console.log(this.session);
        console.log(this.session._links);
        let itemsUrl = this.configuration.api + this.session._links.items.href;
        let item = {name: taskName};
        return this.http.post(itemsUrl, item).then((response) => {
           this.session.items.push(item);
           return;
        });
    }

    get(sessionId) {
        console.log('get session');
        console.log(sessionId);
        if (arguments.length !== 1) sessionId = this.store.local.get('sessionId');
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
}


export default EstimationSessions;
