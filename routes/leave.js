var express = require('express');
var router = express.Router();
var leaveController = require('./../controller/leave.controller');
var auth = require('./auth');




router.post('/add-leave', leaveController.applyLeave);	
router.get('/get-pendingLeave',leaveController.getLeaves);
router.put('/update-status-by-id/:id',leaveController.updateLeaves);
router.post('/leavesByEmail',leaveController.getLeavesById);
// router.get('/getleave',leaveController.getAllLeaves);
router.get('/list-of-all-leaves-app',leaveController.getAllLeavesApps);
router.get('/approvedLeaves',leaveController.getApprovedLeaves);
router.get('/rejectedLeaves',leaveController.getRejectedLeaves);

// router.get('/empLeaves/:id',leaveController.myLeaves);


module.exports = router;