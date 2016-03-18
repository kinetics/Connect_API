'use strict';
var track_model = require('.././db/db_tracks.js');


exports.createTrack = function(req, res, next) {
    track_model.create_track(req.body.trackName, function(err, result) {
        if (err) next(err);
        var json = result.rows;
        res.status(200).send(json);
    })
};

exports.fetchUniqueTrack = function(req, res, next) {
    track_model.get_track(req.body.trackID, function(err, result) {
        if (err) next(err);
        var track = result.rows;
        res.status(200).send(track);
    })
};

exports.update = function(req, res, next) {
    track_model.update_track(req.body.newTrackName, function(err, result) {
        if (err) next(err);
        var json = result.rows;
        res.status(200).send(json);
    });
};

exports.delete = function(req, res, next) {
    track_model.delete_track(req.params.trackID, function(err, result) {
        if (err) next(err);
        var json = result.rows;
        res.status(200).send(json);
    });
};

exports.list = function(req, res, next) {
    track_model.fetch_all_tracks(function(err, result) {
        if (err) return next(err);
        var json = result.rows;
        res.status(200).send(json);
    });
};
