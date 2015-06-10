var express = require('express');
var router = express.Router();
var Session = require('../model/session');
var _ = require('lodash');

router.post('/', function(req, res, next) {
  var session = new Session({name: req.body.name, items: []});
  session.save(function() {
    var updated = session.toObject();
    updated.links = [{rel: "items", href:"/sessions/" + session._id + "/item"}];
    res.json(updated);
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
      console.log(session);
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

router.post('/:sessionId/item/:itemId/estimate', function(req, res, next) {
  res.statusCode = 200;
  res.send();
});

router.get('/:sessionName/items/:itemId', function(req, res, next) {
  Session.findOne({name:req.params.sessionName}).then(function(session) {
    res.send(_.first(_.filter(session.items, function(item){return item._id == req.params.itemId})));
  });
});

module.exports = router;
