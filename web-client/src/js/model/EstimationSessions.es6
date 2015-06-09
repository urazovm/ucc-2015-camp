class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
    }


    create(sessionName) {

        console.log(sessionName);


        let payload = sessionName;
        return this.http.post(this.configuration.api + '/sessions', payload).then((response) => {
            console.log(response);
        });


    }
}


export default EstimationSessions;