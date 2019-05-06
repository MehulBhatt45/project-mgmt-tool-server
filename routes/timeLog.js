var express = require('express');
var router = express.Router();
var timeLogController = require('./../controller/timeLog.controller');
var auth = require('./auth');


router.post('/timeLog',timeLogController.addTimeLog);



module.exports = router;
