'use strict';

var pg = require('.././postgres_connect');
var assert = require('assert');

/**
 *
 * User Login function. Checks the database for the username/password combination and returns either true or false.
 *
 *  @param username             The user's login identity. Must be a valid username string.
 *  @param password             The user's password. Must be a valid password string.
 *  @param next:                The callback fired to return to callee. This callback should include 2 parameters: err, result.
 *
 *  This function may fail for several reasons:
 *
 *  Invalid Param               The username is not a valid username string.
 *  Invalid propertyName        There is a non-valid parameter in the request (aka something that shouldn't be there).
 *  TimeoutError                The Database takes too long to return.
 *  SystemError                 The Database refuses the connection.
 *  Incorrect U/P               The user provided the incorrect credentials.
 *
 */
exports.user_login = function(username, password, next) {
  //assert.equal(typeof username, 'string', "Username must be a string with no invalid characters.");
  //assert.equal(typeof password, 'string', "password must be a string type");
  assert.equal(typeof next, 'function', "callback must be a function");

  pg.client(function (err, client, done) {
    if (err) return next(err);
    client.query('SELECT user_login($1, $2)', [username, password], function (err, result) {
      done();
      if (err) {
        return next(err);
      }
      var json = result.rows;
      if (json[0].user_login === false) {
        return next(null, 401);
      } else if (json[0].user_login === null) {
        return next(null, 401);
      }
      return next(null, null, 'success.');
    });
  });
};

exports.fetch_user_id = function(userName, callback) {
  assert.equal(typeof userName, 'string', 'username must be a string');
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('SELECT return_userID($1)', [userName], function(err, result) {
      if (err) return callback(err);
      var userID = result.rows[0].return_userid;
      callback(null, userID);
    });
  });
};

exports.user_signup = function(firstName, lastName, email, displayName, password, callback) {
  //assert.equal(typeof password, 'string', 'password must be a string');
  //assert.equal(typeof firstName, 'string', 'First name must be a string');
  //assert.equal(typeof lastName, 'string', 'Last name must be a string');
  //assert.equal(typeof displayName, 'string', 'Display name must be a string');
  //assert.equal(typeof callback, 'function', 'callback must be a function)');
  //assert.equal(typeof email, 'string', 'email must be a string');

  pg.client(function( err, client, done) {
    if (err) return callback(err);
    var queryText = 'SELECT create_user($1, $2, $3, $4, $5)';
    client.query(queryText, [firstName, lastName, email, displayName, password], function(err, result) {
      done();
      if (err) return callback(err);
      return callback(null, result);
    });
  });
};
