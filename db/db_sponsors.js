'use strict';
var pg = require('./postgres_connect');

exports.fetch_all_sponsors = function(callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('SELECT * FROM fetch_sponsor_list()', function(err, result) {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};
