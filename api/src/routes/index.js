var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user');
var validate = require('express-jsonschema').validate;

function invalidUsernameOrPassword() {
  var err = new Error('Invalid username/password');
  err.status = 401;
  return err;
}

var inbound = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  }
};

router.get('/login', function(req, res, next) {
  var accessToken = req.get('X-Auth-Token');
  if (!accessToken) return next(invalidUsernameOrPassword());

  jwt.verify(accessToken, 'secretKey', function(err, decodedToken) {
    if (err) return next(invalidUsernameOrPassword());
    User.findOne({username: decodedToken.username}).then(function(existingUser) {
      res.json(existingUser.map());
    });
  });
});

router.post('/login', validate({body: inbound}), function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).then(function(existingUser) {
    if (existingUser && existingUser.authenticate(password))
      return res.json(existingUser.map());
    next(invalidUsernameOrPassword());
  });
});

module.exports = router;
