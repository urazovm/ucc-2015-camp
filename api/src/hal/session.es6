var _ = require('lodash');

class Links {
    constructor(self) {
        this.self = {href: self}
    }

    addFromSelf(name, href) { this[name] = { href : this.self + href } }
}

class Session {
    constructor(session) {
        this._links = new Links('/sessions/' + session._id);
        this._links.addFromSelf("items", '/items');
        this.session = {
            id: session._id,
            name: session.name
        }
    }
}

class Sessions {
    constructor(sessions) {
        this._links = new Links('/sessions');
        this.sessions = _.map(sessions, s => new Session(s))
    }
}

module.exports = {
    Sessions: Sessions,
    Session: Session
};