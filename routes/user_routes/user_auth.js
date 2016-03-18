'use strict';

var express = require('express');
var router = express.Router();
var auth_ctrl = require('../.././controllers/user_ctrls/users_auth');

router.post('/login', auth_ctrl.login);
router.post('/signup', auth_ctrl.signup);
router.post('/validateT', auth_ctrl.validateToken);

module.exports = router;
