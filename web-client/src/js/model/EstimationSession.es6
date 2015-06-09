class EstimationSession {


    constructor(http, store, events, configuration) {
        this.store = store;
        this.http = http;
        this.events = events;
        this.configuration = configuration;
    }


    start(sessionName) {

        console.log(sessionName);
    }
}


export default EstimationSession;