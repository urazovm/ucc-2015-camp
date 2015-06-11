var express = require('express');
var router = express.Router();
var Session = require('../model/session');
var _ = require('lodash');

router.get('/', function (req, res) {
    var query = req.query.q;
    if (query) {
        Session.find({name: query}).then(
            function (sessions) {
                res.json(halSessions(sessions));
            }
        );
    } else {
        Session.find().then(
            function (sessions) {
                res.json(halSessions(sessions));
            }
        );

    }
});


router.post('/', function (req, res) {
    var session = new Session({name: req.body.name, items: []});
    session.save().then(function (session) {
        res.statusCode = 201;
        res.send('/sessions/' + session._id);
    }, function (err) {
        res.sendStatus(400).send(err.stack);

    });
});

router.get('/:sessionId', function (req, res) {
    Session.findById(req.params.sessionId).then(function (session) {
        if (session) res.json(halSession(session));
        else res.sendStatus(404);
    });
});

router.get('/:sessionId/items', function (req, res, next) {
    Session.findById(req.params.sessionId).then(function (session) {
        if (session) res.json(halItems(session));
        else res.sendStatus(404);
    });
});

router.post('/:sessionId/items', function (req, res) {
    Session.findById(req.params.sessionId, function (err, session) {
        if (err) {
            res.sendStatus(500)
        }
        else if (session) {
            session.items.push({name: req.body.name});
            session.save(function () {
                res.sendStatus(201);
            });
        }
    })
});

router.get('/:sessionId/items/:itemId', function (req, res, next) {
    Session.findById(req.params.sessionId, function (err, session) {
        var item = _.first(_.filter(session.items, function (item) {
            return item._id == req.params.itemId
        }));
        var parent = '/sessions/'+ req.params.sessionId + '/items';
        res.send(halItem(parent, item));
    });
});

router.post('/:sessionId/items/:itemId/estimates', function (req, res) {
    Session.findById(req.params.sessionId).then(function (session) {
        var item = _.first(_.filter(session.items, function (item) {
            return item._id == req.params.itemId;
        }));
        item.estimates.push(req.body.estimate);
        session.save(function () {
            res.statusCode = 200;
            var io = req.app.get('io');
            io.sockets.emit('estimateUpdated',  session._id );
            res.send();
        });
    });


});

function halItem(parent, item) {
    var self = parent + '/' + item._id;
    var estimates = _(item.estimates);
    var stats = {
        min: 0,
        max: 0,
        total: 0,
        average: 0,
        stddev: 0
    };
    if (estimates.size() > 0) {
        stats.min = estimates.min();
        stats.max = estimates.max();
        stats.total = estimates.reduce(function (total, n) {
            return total + n;
        });
        stats.average = stats.total / estimates.size();
        stats.stddev = Math.sqrt(estimates.map(function (e) {
            var diff = e - stats.average;
            return (diff * diff) / (estimates.size() - 1);
        }).reduce(function (total, n) {
            return total + n;
        })) / stats.average;
    }
    return {
        _links: {
            self: {href: self},
            estimates: {href: self + '/estimates'}
        },
        item: _.extend(stats, {
            id: item._id,
            name: item.name,
            description: item.description
        })
    };

}

function halSession(session) {
    var self = '/sessions/' + session._id;
    return {
        _links: {
            self: {href: self},
            items: {href: self + '/items'}
        },
        session: {
            id: session._id,
            name: session.name
        }
    };

}

function halSessions(sessions) {
    return {
        _links: {self: {href: '/sessions'}},
        sessions: _.map(sessions, function (session) {
            return halSession(session);
        })
    };
}

function halItems(session) {
    var self = '/sessions/' + session._id + '/items';
    return {
        _links: {self: {href: self}},
        items: _.map(session.items, function (item) {
            return halItem(self, item);
        })
    };
}


module.exports = router;
