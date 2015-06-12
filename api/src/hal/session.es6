var _ = require('lodash');

class Session {
    constructor(session) {
        let self = '/sessions/' + session._id;
        this._links = {
            self: {href: self},
            items: {href: self + '/items'}
        };
        this.session = {
            id: session._id,
            name: session.name
        }
    }
}

class Sessions {
    constructor(sessions) {
        this._links = {
            self: {href: '/sessions'}
        };
        this.sessions = _.map(sessions, s => new Session(s))
    }
}

module.exports = {
    Sessions: Sessions,
    Session: Session
};