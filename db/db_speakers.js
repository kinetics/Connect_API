'use strict';

var pg = require('./postgres_connect');

exports.fetch_speakers = function(callback) {
    pg.client(function (err, client, done) {
        if (err) callback(err);
        client.query('SELECT * FROM fetch_all_speakers()', function(err, resultSet) {
            done();
            if (err) callback(err);
            callback(null, resultSet);
        });
    });
};

exports.fetch_unique_speaker = function(speakerID, callback) {
    console.log('speaker requested');
    pg.client(function(err, client, done) {
        if (err) return callback(err);
        client.query('SELECT * FROM fetch_unique_speaker('  + speakerID  + ')', function(err, result) {
            done();
            if (err) return callback(err);
            callback(null, result);
        })
    })
};

/**
 *
 * @param speakerID.
 * @param callback
 */
exports.fetch_speaker_sessions = function(speakerID, callback) {
    console.log('sessions request');
    pg.client(function(err, client, done) {
        if (err) return callback(err);
        client.query('SELECT * FROM fetch_unique_speaker_sessions(' + speakerID + ')', function(err, result) {
            done();
            if (err) callback(err);
            callback(null, result);
        });
    });
};

exports.fetch_all_speaker_sessions = function(callback) {
  pg.client(function(err, client, done) {
    if (err) return callback(err);
    client.query('SELECT * FROM sessionSpeaker', function(err, result) {
      done();
      if (err) return callback(err);
      callback(null, result);
    })
  })
}
