'use strict';
var alerts = require('.././db/db_alerts');
var azure = require('azure');
var notificationHubService = azure.createNotificationHubService('conjs','Endpoint=sb://conjs-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=Z2abm06ny6NEOMA2ki8hktGSW55siYc9hJIs/DD5uA8=');
var pg = require('../db/postgres_connect');

exports.list = function(req, res, callback) {
    alerts.fetch_all_alerts(function(err, result) {
        if (err) return callback(err);
        res.json(result.rows);
    })
};


exports.fetchTopAlert = function(req, res, callback) {
  alerts.fetch_top_alert(function(err, resp) {
    if (err) return callback(err);
    if (resp.rows.length === 0) {
      res.send(304).send({message: 'No alerts to show'});
    }
    res.json(resp.rows);
  });
};


exports.registerDevice = function(req, res, next) {

    // This is the tags array. This attaches the requested registration to any tags put into this array.
    // We can then send Notifications specifically to user's associated with those tags.
    var tags = [
        'connectjs'
    ];
    // Add the userID to available tags, so that we can push to specific users.
    if (req.body.user) tags.push(req.body.user.userID);
    // If there is an eventID present, add this to the tags.
    if (req.body.event) tags.push(req.body.event);
    if (req.body.os === 'Android') {
        notificationHubService.gcm.createNativeRegistration(req.body.registration, tags, null, function (err, result) {
            if (err) {
                return next(err);
            }
            notificationHubService.gcm.listRegistrationsByGcmRegistrationId(req.body.registration, null, function (err, result) {
                if (err) next(err);
                console.log('list: ' + JSON.stringify(result));
            });
            console.log(result);
            return res.json(result);
        });
    }
    else {
        notificationHubService.apns.createNativeRegistration(req.body.registration, tags, null, function (err, result) {
            if (err) {
                return next(err);
            }
            console.log(result);
            return res.json(result);
        });
    }
};


exports.deregisterDevice = function(req, res, next) {
    // Note: Do not delete the device data so we keep the analytics. Move the analytics data if they re-register as a login.
    notificationHubService.deleteRegistration(req.body.registrationId, null, function(err, result) {
        if (err) next(err);
        res.json(result);
    });
};

exports.fetchUniqueAlert = function() {

};
