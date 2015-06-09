class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.tasks = [];
        this.session = {};
    }


    create(sessionName) {

        return this.http.get(this.configuration.api + '/sessions/123456').then((response) => {
            console.log(response.data);
            this.session = response.data;
            return;
        });
    }

    addTask(taskName){
        this.tasks.push({name : taskName});
    }
}


export default EstimationSessions;
