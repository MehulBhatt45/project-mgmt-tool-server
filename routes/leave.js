var express = require('express');
var router = express.Router();
var leaveController = require('./../controller/leave.controller');
var auth = require('./auth');



router.post('/leaveApplication', leaveController.applyLeave);	



module.exports = router;