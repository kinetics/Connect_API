'use strict';

var alerts = require('.././db/db_alerts');
var alertQueue = require('./alert_queue');
var azure = require('azure');

//////////////////// Alerts


exports.newBroadcast = function(req, res, callback) {
    if (req.body.schedule) {
        alertQueue.add(req.body.notification, function(err, result) {
            if (err) return callback(err);
            res.json(result);
        });
    } else {
        var notificationHubService = azure.createNotificationHubService('conjs','Endpoint=sb://conjs-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=Z2abm06ny6NEOMA2ki8hktGSW55siYc9hJIs/DD5uA8=');
        var payload = {
            data: {
                'message': req.body.notification.message,
                'msgcnt': '1',
                'title' : req.body.notification.title
            }
        };
        var payload_apns = {
            'alert': req.body.notification.message,
            'title' : req.body.notification.title
        };
        var tag = req.body.tag ? req.body.tag : null;
        // if this is a scheduled notification we save it and end the request. The schedule event loop will see it from there.
        var gcm = '';
        notificationHubService.gcm.send(tag, payload, function (error, result) {
            if (error) {
                console.log(error);
                callback(error);
            }
            console.log('Notification Sent');
            gcm = result;
        });
        notificationHubService.apns.send(tag, payload_apns, function (err, result) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            console.log('Notification sent');
            res.json('send: ' + JSON.stringify(result) + 'Android: ' + JSON.stringify(gcm));
        });
    }
};



//////////////////// Sessions

exports.createSession = function(req, res, callback) {
    session_model.createSession(req.body.session, function(err, result) {
        if (err) callback(err);
        res.json(result.rows);
    });
};

exports.updateSession = function(req, res, next) {
    req.checkParams('sessionID', 'Inalid PutParam').notEmpty().isInt();
    req.body.sessionID = req.params.sessionID;
};

exports.deleteSession = function(req, res, next) {
    req.checkParams('sessionID', 'Inalid PutParam').notEmpty().isInt();
};

//////////////////// Speakers

exports.createSpeaker = function(req, res, next) {

};

exports.updateSpeaker = function(req, res, next) {

};

exports.deleteSpeaker = function(req, res, next) {

};

//////////////////// Tracks

exports.createTrack = function(req, res, next) {

};

exports.updateTrack = function(req, res, next) {

};

exports.deleteTrack = function(req, res, next) {

};

//////////////////// Users

exports.createUser = function(req, res, next) {

};

exports.updateUser = function(req, res, next) {

};

exports.deleteUser = function(req, res, next) {

};

