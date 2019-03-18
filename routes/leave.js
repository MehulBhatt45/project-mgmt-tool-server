var express = require('express');
var router = express.Router();
var leaveController = require('./../controller/leave.controller');
var auth = require('./auth');




router.post('/add-leave', leaveController.applyLeave);	
router.get('/get-pendingLeave',leaveController.getLeaves);
router.put('/update-status-by-id/:id',leaveController.updateLeaves);
router.get('/leavesById/:email',leaveController.getLeavesById);
// router.get('/empLeaves/:id',leaveController.myLeaves);


module.exports = router;