var express = require('express');
var router = express.Router();
var Session = require('../model/session');
var _ = require('lodash');

router.get('/sendevent', function(req, res, next) {


  console.log('sending event');
  res.sendStatus(200);
});

router.post('/', function(req, res, next) {
  var session = new Session({name: req.body.name, items: []});
  session.save(function(err) {
    if (err) {
      res.statusCode = 400;
      res.send(err);
    } else {
      var updated = session.toObject();
      updated.links = [{rel: "items", href: "/sessions/" + session._id + "/item"}];
      res.json(updated);
    }
  });
});

router.get('/', function(req, res, next) {
  res.send({
    items: [
      {
        name:'Dummy Session',
        links: [
          {rel: "self", href: "/sessions/123456"}
        ]
      }
    ]
  })
});

router.get('/:sessionName', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(
    function(session) {
      if (session) res.send(session);
      else res.sendStatus(404);
    }
  );
});

router.post('/:sessionId/item', function(req, res, next) {
  Session.findById(req.params.sessionId, function (err, session) {
    if (err) { res.sendStatus(500) }
    else if (session) {
      session.items.push({name: req.body.name});
      session.save(function () {
        res.sendStatus(201);
      });
    }
  })
});

router.post('/:sessionName/item/:itemId/estimate', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(function(session) {

    var item = _.first(_.filter(session.items, function(item){return item._id == req.params.itemId}));
    item.estimates.push(req.body.estimate);

    session.save(function() {
      res.statusCode = 200;
      var io = req.app.get('io');
      io.sockets.emit('estimateUpdated', {session: session.toObject()});
      res.send();
    });
  });


});

router.get('/:sessionName/items/:itemId', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(function(session) {
    var item = _.first(_.filter(session.items, function(item){return item._id == req.params.itemId})).toObject();
    item.links = [{rel: "estimate", href:"/sessions/" + req.params.sessionName + "/item/" + req.params.itemId + '/estimate'}];
    var estimates = _(item.estimates);
    if (estimates.size() > 0) {
      item.min = estimates.min();
      item.max = estimates.max();
      item.total = estimates.reduce(function(total, n) { return total + n; });
      item.average = item.total / estimates.size();
    }
    res.send(item);
  });
});

module.exports = router;
