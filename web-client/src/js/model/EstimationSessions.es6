import _ from "lodash"

class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.session = {};
    }


    create(sessionName) {

        return this.http.post(this.configuration.api + '/sessions', {name : sessionName}).then((response) => {
            this.session = response.data;
            return;
        });
    }

    addTask(taskName){
        console.log(this.session.links);
        let itemsUrl = this.configuration.api + _.result(_.find(this.session.links, {rel: "items"}), "href")
        let item = {name: taskName};
        return this.http.post(itemsUrl, item).then((response) => {
           this.session.items.push(item);
           return;
        });
    }

    updateSession(session){
        this.session = session;
    }
}


export default EstimationSessions;
