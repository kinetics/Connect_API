'use strict';

var express = require('express');
var router = express.Router();
var networking = require('../.././controllers/user_ctrls/networking_ctrl');
var auth = require('../.././controllers/user_ctrls/users_auth');

router.get('/friends', auth.validateToken, networking.fetchUserFriends);
router.get('/friends/search', auth.validateToken, networking.fetchUsers);
router.post('/friends/:friendID', auth.validateToken, networking.userShare);
router.delete('/friends/:friendID', auth.validateToken, networking.removeUserShare);
router.get('/friends/requests',auth.validateToken, networking.fetchShareRequests);
router.get('/friends/sharedTo', auth.validateToken, networking.usersSharedTo);

module.exports = router;
