'use strict';

var express = require('express');
var router = express.Router();
var track_ctrl = require('.././controllers/track_ctrl.js');

router.get('/tracks', track_ctrl.list);
router.get('/track/:trackID', track_ctrl.fetchUniqueTrack);

module.exports = router;