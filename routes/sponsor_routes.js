'use strict'

var express = require('express');
var router = express.Router();
var sponsors = require('.././controllers/sponsor_ctrl');

router.get('/sponsors', sponsors.list);

module.exports = router;
