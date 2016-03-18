'use strict';

var express = require('express');
var router = express.Router();
var alerts = require('.././controllers/alerts_ctrl');

router.get('/alerts', alerts.list);
router.get('/alerts/top', alerts.fetchTopAlert);


module.exports = router;
