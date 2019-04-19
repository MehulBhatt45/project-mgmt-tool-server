var express = require('express');
var router = express.Router();
var attendenceController = require('./../controller/attendence.controller');
var auth = require('./auth');


router.post('/emp-attendence',attendenceController.employeeAttendence);
router.post('/get-attendence-by-get-and-id' , attendenceController.getAttendenceByDateAndId);
router.post('/AllemployeeAttendenceByDate',attendenceController.AllemployeeAttendenceByDate);

module.exports = router;