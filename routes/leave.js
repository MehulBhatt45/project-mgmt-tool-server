var express = require('express');
var router = express.Router();
var leaveController = require('./../controller/leave.controller');
var auth = require('./auth');



router.post('/leaveApplication', leaveController.applyLeave);
router.get('/pendingLeaves',leaveController.getLeaves);	



module.exports = router;