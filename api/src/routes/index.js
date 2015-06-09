var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user');

function invalidUsernameOrPassword() {
  var err = new Error('Invalid username/password');
  err.status = 401;
  return err;
}

function responseJson(user) {
  return {
    user: {username: user.username},
    accessToken: jwt.sign({username: user.username}, 'secretKey')
  }
}

router.get('/login', function(req, res, next) {
  var accessToken = req.get('X-Auth-Token');
  jwt.verify(accessToken, 'secretKey', function(err, decodedToken) {
    if (err) return next(invalidUsernameOrPassword());
    User.findOne({username: decodedToken.username}).then(function(existingUser) {
      return res.json(responseJson(existingUser));
    });

  });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    User.findOne({username: username}).then(function(existingUser) {
      if (existingUser && existingUser.authenticate(password))
        return res.json(responseJson(existingUser));
      else return next(invalidUsernameOrPassword());
    });
  }
  else return next(invalidUsernameOrPassword());
});

module.exports = router;
