'use strict';

var express = require('express');
var router = express.Router();
var speakers = require('.././controllers/speakers_ctrl');

router.get('/speakers', speakers.fetchSpeakers);
router.get('/speakers/:speakerID', speakers.fetchUniqueSpeaker, speakers.fetchSpeakerSessions);
router.get('/speakers/:speakerID/sessions', speakers.fetchSpeakerSessions);
router.get('/speakersessions', speakers.fetchAllSpeakerSessions);

module.exports = router;
