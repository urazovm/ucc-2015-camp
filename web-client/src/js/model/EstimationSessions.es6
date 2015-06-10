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
        let itemsUrl = this.configuration.api + _.result(_.find(this.session.links, {rel: "items"}), "href")
        let item = {name: taskName};
        this.http.post(itemsUrl, item).then(function () {
           this.session.items.push(item);
        });
    }

    startTask(task){

    }
}


export default EstimationSessions;
