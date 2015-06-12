var express = require('express');
var router = express.Router();
var Session = require('../model/session');
var mongoose = require('mongoose');
var _ = require('lodash');
var HttpError = require('../errors');

router.get('/', function (req, res, next) {
    var query = {};
    if (req.query.q) query.name = req.query.q;
    Session.find(query).then(function (sessions) {
      return res.json(halSessions(sessions));
    }).then(null, next);
});

router.post('/', function (req, res, next) {
  new Session({name: req.body.name, items: []}).save()
      .then(function(session) { return res.status(201).send('/sessions/' + session._id); },
            function(err) { return res.status(400).send(err.stack) });
});

router.get('/:sessionId', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) return res.sendStatus(404);

    Session.findById(req.params.sessionId).then(function (session) {
        if (session) res.json(halSession(session));
        else res.sendStatus(404);
    }).then(null, next);
});

router.get('/:sessionId/items', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) return res.sendStatus(404);

    Session.findById(req.params.sessionId).then(function (session) {
        if (session) res.json(halItems(session));
        else res.sendStatus(404);
    }).then(null, next);
});

router.post('/:sessionId/items', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) return res.sendStatus(404);

    Session.findById(req.params.sessionId).then(function (session) {
      if (!session) throw new HttpError('The session could not be found', 404);
      if (!req.body.name) throw new HttpError('The name for the item is required', 400);
      return session;
    }).then(function(session) {
      session.items.push({name: req.body.name});
      return session.save();
    }).then(function() {
      res.sendStatus(201);
    }).then(null, next);
});

router.get('/:sessionId/items/:itemId', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) return res.sendStatus(404);
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) return res.sendStatus(404);

    Session.findById(req.params.sessionId).then(function (session) {
        var item = _.first(_.filter(session.items, function (item) {
            return item._id == req.params.itemId
        }));
        var parent = '/sessions/'+ req.params.sessionId + '/items';
        res.send(halItem(parent, item));
    }).then(null, next);
});

router.post('/:sessionId/items/:itemId/estimates', function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) return res.sendStatus(404);
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) return res.sendStatus(404);

    if (req.body.estimate) {
      Session.findById(req.params.sessionId).then(function (session) {
          var item = _.first(_.filter(session.items, function (item) {
              return item._id == req.params.itemId;
          }));
          item.estimates.push(req.body.estimate);
          session.save(function () {
              var io = req.app.get('io');
              io.sockets.emit('estimate-'+session._id,  session._id );
              res.sendStatus(200);
          });
      }).then(null, next);
    } else return res.sendStatus(400);
});

function halItem(parent, item) {
    var self = parent + '/' + item._id;
    var estimates = _(item.estimates);
    var stats = {
        min: 0,
        max: 0,
        total: 0,
        average: 0,
        stddev: 0,
        noOfVotes:0
    };
    if (estimates.size() > 0) {
        stats.min = estimates.min();
        stats.max = estimates.max();
        stats.total = estimates.reduce(function (total, n) {
            return total + n;
        });
        stats.average = stats.total / estimates.size();
        stats.noOfVotes = estimates.size();
        if( estimates.size() > 1) {
            stats.stddev = Math.round((Math.sqrt(estimates.map(function (e) {
                var diff = e - stats.average;
                return (diff * diff) / (estimates.size() - 1);
            }).reduce(function (total, n) {
                return total + n;
            })) / stats.average) *100);
        }
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
