'use strict';

var pg = require('../../db/db_users/db_auth');
var jwt = require('jsonwebtoken');


exports.login = function(req, res, next) {
  console.log('Login request');
  var username = req.body.user.email;
  var password = req.body.user.password;
  var user = req.body.user;
  req.body.user.email = '';
  req.body.password = '';
  pg.user_login(username, password, function(err, unauthorized, authorized) {
    if (err) return next(err);
    if (unauthorized) return res.status(401).send('Unauthorized.');
    pg.fetch_user_id(username, function(err, userID) {
      if (err) return next(err);
      user.userID = userID;
      // Remember to not store this secret in your production application code. You need to abstract it into an environment variable that is only accessible
      // via the server (such as in a process variable).
      var token = jwt.sign(user, 'tempsecret', {
        // Change this to however you want.
        expiresInMinutes: 4320
      });
      res.json({'token' : token});

    });
  });
};

exports.signup = function(req, res, callback) {
  if (!req.body.user) return callback({message:'No user object provided.'});
  var user = req.body.user;
  req.password = '';
  pg.user_signup(user.firstName, user.lastName, user.email, user.displayName, user.password, function(err, user) {
    if (err) return callback(err);
    //var token = jwt.sign(user, 'tempsecret', {
    //  expiresInMinutes: 4320
    //});
    //res.setHeader('token', token);
    // Should contain a JWT token to be stored and used client side.
    res.json({'message' : 'user created.'});
  });
};

// Token heartbeat function.
exports.validateToken = function(req, res, next) {
  var token = req.headers['token'];
  if (token) {
    console.log(token);
    jwt.verify(token, 'tempsecret', function(err, decoded) {
      if (err) {
        return res.status(401).send('Unauthrized');
      }
      req.decoded = decoded;
      req.params.userID = decoded.userID;
      console.log(req.params.userID);
      console.log(decoded);
      next();
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

exports.forgotPassword = function() {

};

exports.logout = function(req, res, next) {

};
