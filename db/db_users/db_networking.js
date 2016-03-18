'use strict';

var pg = require('.././postgres_connect');

exports.user_share = function(userFromID, userToID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select user_share_details($1, $2)', [userFromID, userToID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

exports.users_shared_to = function(userID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select * from users_shared_to($1)', [userID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

exports.remove_user_share = function(userID, userFriendID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select remove_user_share($1, $2)', [userID, userFriendID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

exports.fetch_user_friends = function(userID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select * FROM fetch_user_shares($1)', [userID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

exports.fetch_share_requests = function(userID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select * from fetch_user_requests($1)', [userID], function(err, result) {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

exports.fetch_users = function(callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select * FROM fetch_user_list()', function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};
