var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user');

function invalidUsernameOrPassword() {
  var err = new Error('Invalid username/password');
  err.status = 401;
  return err;
}

router.get('/login', function(req, res, next) {
  var accessToken = req.get('X-Auth-Token');
  jwt.verify(accessToken, 'secretKey', function(err, user) {
    if (err) return next(invalidUsernameOrPassword());
    User.findOne({username: user.username})
      .then(function(existingUser) {
        res.json({
          user: existingUser,
          accessToken: jwt.sign({username: existingUser.username}, 'secretKey')
        });
    });

  });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {
    User.findOne({username: username}).then(function(existingUser) {
      if (existingUser.authenticate(password)) {
        res.json({
          user: existingUser,
          accessToken: jwt.sign({username: existingUser.username}, 'secretKey')
        });
      }
      else return next(invalidUsernameOrPassword());
    });
  }
  else return next(invalidUsernameOrPassword());
});

module.exports = router;
