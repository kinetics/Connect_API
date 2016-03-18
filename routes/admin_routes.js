'use strict';

var express = require('express');
var router = express.Router();

var admin = require('.././controllers/admin_ctrl');

// Alerts
router.post('/alerts', admin.newBroadcast);

// Sessions
router.post('/sessions', admin.createSession);
router.put('/sessions/:sessionID', admin.updateSession);
router.delete('/sessions/:sessionID', admin.deleteSession);

// Tracks
router.post('/tracks', admin.createTrack);
router.put('/tracks/:trackID', admin.updateTrack);
router.delete('/sessions/:sessionID', admin.deleteTrack);

// Users
router.post('/users', admin.createUser);
router.put('/users/userID', admin.updateUser);
router.delete('/users/userID', admin.deleteUser);

module.exports = router;
