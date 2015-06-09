class EstimationSessions {

    constructor(http, configuration) {
        this.http = http;
        this.configuration = configuration;
    }


    create(sessionName) {
        let payload = {name: sessionName};
        return this.http.post(this.configuration.api + '/sessions', payload).then((response) => {
            console.log(response);
            return response;
        });
    }
}


export default EstimationSessions;
