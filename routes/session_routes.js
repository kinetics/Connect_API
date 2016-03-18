'use strict';

var express = require('express');
var router = express.Router();
var sessions = require('.././controllers/sessions_ctrl');


router.get('/sessions', sessions.fetchAllSessions);
router.get('/sessions/:sessionID', sessions.fetchSession);

module.exports = router;
//router.patch('/sessions/:sessionID', );
