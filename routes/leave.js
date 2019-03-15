var express = require('express');
var router = express.Router();
var leaveController = require('./../controller/leave.controller');
var auth = require('./auth');



<<<<<<< HEAD
router.post('/leaveApplication', leaveController.applyLeave);
router.get('/pendingLeaves' , leaveController.getLeaves);	

=======
router.post('/add-leave', leaveController.applyLeave);	
router.get('/get-pendingLeave',leaveController.getLeaves);
router.put('/update-status-by-id/:id',leaveController.updateLeaves);
>>>>>>> 53dd8c21a075b6e792b681a53e4808a98cd0af56


module.exports = router;