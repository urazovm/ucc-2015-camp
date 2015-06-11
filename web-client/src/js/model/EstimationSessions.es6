import _ from "lodash"

class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.session = {};
    }


    create(sessionName) {
        return this.http.post(this.configuration.api + '/sessions', {name : sessionName}).then((response) => {
            console.log(response.data);
             return this.http.get(this.configuration.api +response.data).then((newSession)=>{
                 console.log(newSession.data._links.items.href);
                 return this.http.get(this.configuration.api + newSession.data._links.items.href).then((itemsResponse) =>{
                         console.log('getting the items')
                         this.session = _.extend(newSession.data.session,{
                             items: itemsResponse.data.items,
                             _links:newSession.data._links
                         });
                         return this.session;
                     }
                 )
             }, (errorResponse) => {
                console.error('FAILURE when creating  session');
            });
        });
    }

    addTask(taskName){
        console.log(this.session);
        let itemsUrl = this.configuration.api + this.session._links.items.href;
        let item = {name: taskName};
        return this.http.post(itemsUrl, item).then((response) => {
           this.session.items.push({item:item});
           return;
        });
    }

    get(sessionId) {
        if (arguments.length !== 1) sessionId = this.store.local.get('sessionId');
        return this.http.get(this.configuration.api + '/sessions/' + sessionId).then(
            (sessionResponse) => {
                return this.http.get(this.configuration.api + sessionResponse.data._links.items.href).then((itemsResponse) =>{
                        let sessionWithItems = _.extend(sessionResponse.data.session, {
                            _links:sessionResponse.data._links,
                            items: itemsResponse.data.items});
                        return sessionWithItems;
                    }
                )
            }, (errorResponse) => {
                console.log('FAILURE  when joining session');
            });
    }
}


export default EstimationSessions;
