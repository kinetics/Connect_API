'use strict';

var pg = require('./postgres_connect');
var moment = require('moment');

/**
 *
 * @param session
 * @param callback
 */
exports.createSession = function(session, callback) {
    pg.client(function (err, client, done) {
        if (err) {
	        callback(err);
		}
		client.query('SELECT * FROM createSession()', [session.sessionName, session.roomID, session.intervalID, session.sessionDesc, session.calendar], function(err, result) {
			done();
			if (err) {
		        callback(err);
            }
			callback(null, result);
		});
	});
};

/**
 *
 * @param callback
 */
exports.fetchAllSessions = function(callback) {
    pg.client(function (err, client, done) {
		//if (handleError(err)) return;
		if (err) callback(err);
		client.query('SELECT * FROM fetchAllSessions()', function(err, resultSet) {
      done();
      if (err) return callback(err);
      callback(null, resultSet);
		});
	});
};

/**
 *
 * @param sessionID
 * @param callback
 */
exports.fetchSingleSession = function(sessionID, callback) {
    pg.client(function (err, client, done) {
		if (err) return callback(err);
		client.query('SELECT fetch_unique_session(' + '\'' + sessionID + '\'' + ')', function(err, result) {
			done();
			if (err) return callback(err);
			callback(null, result);
		});
	});
};

/**
 *
 * @param searchText
 * @param callback
 */
exports.searchForSessions = function(searchText, callback) {
    pg.client(function (err, client, done) {
        if (err) callback(err);
        client.query('searchForSessions()', searchText, function (err, result) {
            done();
            if (err) callback(err);
            return callback(null, result);
        });
    });
};

/**
 *
 * @param callback
 */
exports.update = function(callback) {
	res.json('Update Session.');
};

/**
 *
 * @param sessionID
 * @param callback
 */
exports.deleteSession = function(sessionID, callback) {
	pg.client(function(err, client, done) {
        if (err) callback(err);
        client.query('SELECT delete_session(' + '\'' + sessionID + ')',function (err, result) {
            done();
            if (err) callback(err);
            return callback(null, result);
        });
    });
};
