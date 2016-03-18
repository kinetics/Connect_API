'use strict';

var schedule = require('../.././db/db_users/db_schedule');

exports.fetchUserSchedule = function(req, res, callback) {
  schedule.fetch_user_schedule(req.params.userID, function(err, result) {
    if (err) return callback(err);
    if (result.rows.length === 0) return res.json({'message' : 'No data to display'});
    res.json(result.rows);
  });
};

exports.addToUserSchedule = function(req, res, callback) {
  schedule.user_sched_add(req.params.userID, req.params.sessionID, function(err, result) {
    if (err) return callback(err);
    res.json(result.rows);
  });
};

exports.removeItemFromUserSchedule = function(req, res, callback) {
  schedule.user_sched_remove(req.params.userID, req.params.sessionID, function(err, result) {
    if (err) return callback(err);
    res.json(result.rows);
  });
};
