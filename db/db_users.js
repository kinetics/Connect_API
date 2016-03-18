'use strict';

var pg = require('./postgres_connect');

exports.create = function(req, res, callback) {
    pg.client(function (err, client, done) {
        if (err) callback(err);
        var user = req.body;
        client.query('SELECT create_user(' + '\'' + user.firstName + '\'' + ',' + '\'' +  user.role  + '\'' +  ',' + '\'' + user.lastName  + '\'' +  ',' +  '\'' + user.email  + '\'' +  ','  + '\'' +  user.displayName  + '\'' +  ','  + '\'' +  user.password  + '\'' +  ','  + '\'' + user.azureTag  + '\'' +  ')', function(err, result) {
            if (err) next(err);
            done();
            callback(result);
        });
    });
};

exports.getUser = function(req, res, callback) {
    pg.client(function (err, client, done) {
        if (err) next(err);
        var user = req.params.userID;
        client.query('SELECT * FROM select_user(' + user + ')', function(err, result) {
            if (err) next(err);
            done();
            callback(null, result);
        })
    })
};

exports.updateUser = function(req, res, callback) {
    pg.client(function (err, client, done) {
        if (err) next(err);
        client.query('SELECT update_user_(' + req.body.column + '(' + '\'' + req.body.newValue + '\', ' + req.params.userID + ')', function(err, result) {
            done();
            if (err) next(err);
            callback(null, result);
        });
    });
};



