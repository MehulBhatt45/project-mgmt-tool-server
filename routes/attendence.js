var express = require('express');
var router = express.Router();
var attendenceController = require('./../controller/attendence.controller');
var auth = require('./auth');


router.post('/emp-attendence',attendenceController.employeeAttendence);


module.exports = router;