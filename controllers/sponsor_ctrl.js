'use strict';

var sponsors = require('.././db/db_sponsors');

exports.list = function(req, res, callback) {
  sponsors.fetch_all_sponsors(function(err, result) {
    if (err) return callback(err);
    res.json(result.rows);
  });
};
