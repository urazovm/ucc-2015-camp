var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send({
    items: [
      {name:'Dummy Session', links: [{rel: "self", href: "/sessions/123456"}]}
    ]
  })
});

router.get('/:sessionId', function(req, res, next) {
  if (req.params.sessionId == "123456") {
    res.send({
      id: req.params.sessionId,
      items: [
        {name: 'Item 1', description: 'Lorem Ipsum', estimates: [4, 10, 23, 9]},
        {name: 'Item number 2', description: 'Lorem Ipsum hfhfhfhf'},
        {name: 'I am 3', description: 'Lorem asdfasdf Ipsum', estimates: [8, 0, 3456]},
        {name: 'Four', description: 'Lorem 444444444 v  44 4 4 4Ipsum'}
      ],
      activeItem: {name: 'Four', description: 'Lorem 444444444 v  44 4 4 4Ipsum', links: [
        {rel: "estimate", href: "/sessions/123456/item/98765/estimate"}
      ]}
    });
  } else res.sendStatus(404);
});

router.post('/:sessionId/item/:itemId/estimate', function(req, res, next) {
  res.statusCode = 200;
  res.send();
});

module.exports = router;
