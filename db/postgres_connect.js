'use strict';

// This module returns a PG client from the connection pool.

var pg = require('pg').native;
var user = 'postgres';
var host = 'localhost';
var port = 5432;
var password = 'enter_your_password';
var connectionString = 'postgres://' + user + ':' + password + '@' + host + ':' + port + '/' + 'connectjs';

/**
 *
 * @param callback
 *      Returns the connection results (error, client object, and done object).
 *      Done Object should be used to end the connection after finished with CLient.
 */
exports.client = function(callback) {
    // It's important to return the done callback here. We don't want to leave the connection open.
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            return callback(err);
        }
        return callback(null, client, done);
    })
};
