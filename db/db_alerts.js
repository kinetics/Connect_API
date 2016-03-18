'use strict';

var pg = require('./postgres_connect');

exports.fetch_all_alerts = function(callback) {
    pg.client(function( err, client, done) {
        if (err) return callback(err);
        client.query('SELECT * FROM fetch_all_alerts()', function(err, result) {
            done();
            if (err) return callback(err);
            return callback(null, result);
        });
    });
};

exports.fetch_top_alert = function(callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('SELECT * FROM notifications WHERE notificationtime = (SELECT MAX(notificationtime) from notifications);', function(err, result) {
      done();
      if (err) return callback(err);
      return callback(null, result);
    });
  });
};
