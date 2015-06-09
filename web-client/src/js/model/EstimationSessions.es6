class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.tasks = [];
    }


    create(sessionName) {



       // let payload = sessionName;
        //return this.http.post(this.configuration.api + '/sessions', payload).then((response) => {
        //    console.log(response);
        //});
        this.name = sessionName;

    }

    addTask(taskName){
        this.tasks.push({name : taskName});
    }
}


export default EstimationSessions;
