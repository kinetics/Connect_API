'use strict';
var db_users = require('.././db/db_speakers');
var ok = require('okay');

exports.fetchSpeakers = function(req, res, callback) {
    db_users.fetch_speakers(ok(callback, function(result) {
        var json = result.rows;
        res.json(json);
    }));
};

exports.fetchUniqueSpeaker = function(req, res, callback) {
    db_users.fetch_unique_speaker(req.params.speakerID, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        req.body.speakerObject = result.rows[0];
        callback();
        //res.json(json);
    });
};

exports.fetchSpeakerSessions = function(req, res, callback) {
    db_users.fetch_speaker_sessions(req.params.speakerID, function(err, result) {
        if (err) callback(err);
        var speakerSessions = result.rows;
        var speakerObject = req.body.speakerObject;

        // Attach both the speaker object and speaker sessions object.
        res.json({speakerSessions: speakerSessions, speaker : speakerObject});
    });
};

exports.fetchAllSpeakerSessions = function(req, res, callback) {
  db_users.fetch_all_speaker_sessions(function(err, result) {
    if (err) return callback(err);
    var speakerSessions = result.rows;
    res.json(speakerSessions);
  });
};
