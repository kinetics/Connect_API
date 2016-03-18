var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var chalk = require('chalk');
var application = express();

// Routes
var sessions = require('./routes/session_routes');
var auth = require('./routes/user_routes/user_auth.js');
var speakers = require('./routes/speaker_routes');
var tracks = require('./routes/track_routes');
var alerts = require('./routes/alert_routes');
var admin = require('./routes/admin_routes');
var sponsors = require('./routes/sponsor_routes');
var networking = require('./routes/user_routes/networking_routes');
var schedule = require('./routes/user_routes/schedule_routes');

var cors = require('cors');
var expressValidator = require('express-validator');
application.use(cors());
application.use(bodyParser.json());
application.use(expressValidator());

// Handle 404
application.use(function(req, res) {
    res.status(404).send('404: Page not Found.');
});

var allowTokenHeader = function(req, res, next) {
  res.header('Access-Control-Allow-Headers', token);
  next();
};

application.use(allowTokenHeader);

// Handle 500
// log errors here.
application.use(function(error, req, res, next) {
    console.log(chalk.red(error.stack));
    console.log(chalk.red(JSON.stringify(error)));
    res.status(error.statusCode || 500);
    res.format({
        text: function() {
            res.send(error.message);
        },
        json: function() {
            res.send(error);
        }
    });
});

// Create server for the Express application
var server = http.Server(application);

// Start the serer
var listener = server.listen(process.env.PORT || 80, function() {
  console.log('listening at: ' + listener.address().address + ':' + listener.address().port);
});
