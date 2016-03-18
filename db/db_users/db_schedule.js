'use strict';
var pg = require('.././postgres_connect');

//TODO fetch_user_schedule
exports.fetch_user_schedule = function(userID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select * from fetch_user_schedule($1)', [userID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

// TODO user_sched_add
exports.user_sched_add = function(userID, sessionID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select add_to_user_sched($1, $2)', [userID, sessionID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};

// TODO user_sched_remove
exports.user_sched_remove = function(userID, sessionID, callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('select remove_from_user_sched($1, $2)', [userID, sessionID], function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    });
  });
};
