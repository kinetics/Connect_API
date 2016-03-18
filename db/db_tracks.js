'use strict';

var pg = require('./postgres_connect');

exports.create_track = function(trackName, callback) {
    pg.client(function(err, client, done) {
        client.query('SELECT create_track(' + '\'' + trackName + '\'' + ')', function(err, result) {
            if (err) next(err);
            callback(null, result);
        });
    });
};

exports.fetch_all_tracks = function(callback) {
    pg.client(function(err, client, done) {
        client.query('SELECT fetch_all_tracks(' + ')', function(err, result) {
            done();
            if (err) return callback(err);
            callback(null, result);
        })
    })
};

exports.fetch_unique_track = function(trackID, callback) {
    pg.client(function(err, client, done) {
        client.query('SELECT fetch_track(' + '\'' + trackID + '\'' + ')', function(err, result) {
            done();
            if(err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
};

exports.update_track = function(req, res, next) {

};

exports.delete_track = function(trackID, callback) {
    pg.client(function(err, client, done) {
        client.query('SELECT delete_track(' + '\'' + trackID + '\'' + ')', function(err, result) {
            done();
            if (err) callback(err);
            callback(null, result);
        });
    });
};