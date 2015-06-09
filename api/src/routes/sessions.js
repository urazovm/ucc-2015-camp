var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

router.get('/:sessionId', function(req, res, next) {
  res.statusCode = 200;
  res.send({
    id: req.params.sessionId,
    items : [
      {name:'Item 1', description:'Lorem Ipsum'},
      {name:'Item number 2', description:'Lorem Ipsum hfhfhfhf'},
      {name:'I am 3', description:'Lorem asdfasdf Ipsum'},
      {name:'Four', description:'Lorem 444444444 v  44 4 4 4Ipsum'}
    ]
  });
});

router.post('/:sessionId/estimate', function(req, res, next) {
  res.statusCode = 200;
  res.send();
});

module.exports = router;
