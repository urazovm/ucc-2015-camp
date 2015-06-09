class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
        this.session = {};
    }


    create(sessionName) {

        return this.http.get(this.configuration.api + '/sessions/123456').then((response) => {
            this.session = response.data;
            return;
        });
    }

    addTask(taskName){

        //send post with session and task id
        //update the session tasks with response

    }

    startTask(task){

    }
}


export default EstimationSessions;
