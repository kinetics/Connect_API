'use strict';

var express = require('express');
var router = express.Router();
var schedule = require('../.././controllers/user_ctrls/schedule_ctrl');
var auth = require('../.././controllers/user_ctrls/users_auth');

router.get('/schedule',auth.validateToken, schedule.fetchUserSchedule);
router.post('/schedule/:sessionID', auth.validateToken, schedule.addToUserSchedule);
router.delete('/schedule/:sessionID', auth.validateToken, schedule.removeItemFromUserSchedule);

module.exports = router;
